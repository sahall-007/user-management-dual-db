import dotenv from 'dotenv'

dotenv.config()

export const env = {
    PORT: process.env.PORT || '',
    JWT_ACCESS: process.env.JWT_ACCESS || '',
    JWT_REFRESH: process.env.JWT_REFRESH || '',
    MONGO_URI: process.env.MONGO_URI || '',
    RABBITMQ_URL: process.env.RABBITMQ_URL || ''
}