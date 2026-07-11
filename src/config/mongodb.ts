import mongoose from 'mongoose';
import { env } from './env';

const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed");
        process.exit(1);
    }
}

export default connectMongoDB;