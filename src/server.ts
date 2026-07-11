import app from "./app"
import connectMongoDB from "./config/mongodb"
import { env } from "./config/env"

const startServer = async () => {
    await connectMongoDB()
    app.listen(env.PORT, () => {
        console.log(
            `Server is running on port ${env.PORT}`
        );
    });
};

startServer();