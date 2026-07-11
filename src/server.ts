import app from "./app"
import connectMongoDB from "./config/mongodb"
import { connectRabbitMQ } from "./config/rabbitMQ"
import { startUserConsumer } from "./consumers/user.consumer"
import { env } from "./config/env"
import { prisma } from './config/prisma'

const startServer = async () => {
    await connectMongoDB()
    await connectRabbitMQ()
    await prisma.$connect()
    await startUserConsumer()
    app.listen(env.PORT, () => {
        console.log(
            `Server is running on port ${env.PORT}`
        );
    });
};

startServer();