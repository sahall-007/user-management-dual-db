
import { getChannel } from "../config/rabbitMQ"
import { QUEUES } from "../constants/queue.constants"

export const publishUserEvent = async (event: string, data: any) => {
    const channel = getChannel()
    channel.sendToQueue(QUEUES.USER_SYNC, Buffer.from(JSON.stringify({ event, data, })))
}