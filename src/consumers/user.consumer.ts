import { prisma } from "../config/prisma"
import { getChannel } from "../config/rabbitMQ"
import { QUEUES } from "../constants/queue.constants"
import { EVENTS } from "../constants/event.constants"

export const startUserConsumer = async () => {
    const channel = getChannel()
    await channel.assertQueue(QUEUES.USER_SYNC, { durable: true, })

    channel.consume(
        QUEUES.USER_SYNC,
        async (message) => {
            if (!message) return
            try {
                const payload = JSON.parse(message.content.toString())
                switch (payload.event) {
                    case EVENTS.USER_CREATED:
                        console.log('user created through rabbit mq')
                        await prisma.user.create({
                            data: {
                                id: payload.data.id,
                                name: payload.data.name,
                                email: payload.data.email,
                                ...payload.data.role && {role: payload.data.role},
                                ...payload.data.status && {status: payload.data.status}
                            }
                        })
                        break
                    case EVENTS.USER_UPDATED:
                        await prisma.user.update({
                            where: { id: payload.data.id, },
                            data: { 
                                name: payload.data.name, 
                                email: payload.data.email, 
                                ...payload.data.role && {role: payload.data.role},
                                ...payload.data.status && {status: payload.data.status}
                            },
                        })
                        break
                    case EVENTS.USER_STATUS_UPDATED:
                        await prisma.user.update({
                            where: { id: payload.data.id, },
                            data: { status: payload.data.status, },
                        })
                        break
                    case EVENTS.USER_DELETED:
                        await prisma.user.delete({
                            where: { id: payload.data.id, },
                        })
                        break
                    default:
                        console.warn(`Unknown event: ${payload.event}`)
                }
                channel.ack(message)
            } catch (error) {
                console.error("Consumer Error:", error)
                const retryCount = Number(message.properties.headers?.["x-retry"]) || 0
                if (retryCount < 3) {
                    channel.sendToQueue(
                        QUEUES.USER_RETRY,
                        message.content,
                        {
                            persistent: true,
                            headers: { "x-retry": retryCount + 1, },
                        }
                    )
                    console.log(`Message moved to retry queue. Attempt ${retryCount + 1}`)
                }
                channel.ack(message)
            }
        }
    )
}
