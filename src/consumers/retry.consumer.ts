import { getChannel } from "../config/rabbitMQ"
import { QUEUES } from "../constants/queue.constants"

export const startRetryConsumer =
    async () => {
        const channel = getChannel()
        await channel.assertQueue(QUEUES.USER_RETRY, { durable: true, })
        channel.consume(
            QUEUES.USER_RETRY,
            async (message) => {
                if (!message) return
                try {
                    const payload = JSON.parse(message.content.toString())
                    console.log("Retrying:", payload.event)
                    channel.ack(message)
                } catch (error) {
                    console.error(error)
                }
            }
        )
    }