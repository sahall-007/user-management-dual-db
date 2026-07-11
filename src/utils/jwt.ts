import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export const generateAccessToken = (userId: string, role: string, status: string): string => {
    return jwt.sign({userId, role, status}, env.JWT_ACCESS, {
        expiresIn: '15m'
    })
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({userId}, env.JWT_REFRESH, {
        expiresIn: '7d'
    })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS)
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH)
}
