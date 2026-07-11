import { AppError } from '../exceptions/app.error'
import * as authRepository from '../repositories/auth.repository'
import { LoginUserData, RefreshTokenData, RegisterUserData } from '../types/auth.types'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'

export const register = async (userData: RegisterUserData) => {
    const existingUser = await authRepository.findByEmail(userData.email)
    if(existingUser){
        throw new AppError('User already exist', 409)
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await authRepository.createUser({...userData, password: hashedPassword})

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }
}

export const login = async (userData: LoginUserData) => {
    const user = await authRepository.findByEmail(userData.email)
    if(!user) throw new AppError('Invalid credentials', 401)
    
    if(user.status.toUpperCase() == 'BLOCKED') throw new AppError('User is blocked', 403)

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password)
    if(!isPasswordCorrect) throw new AppError('Invalid credentials', 401)

    const accessToken = generateAccessToken(user.id, user.role, user.status)
    const refreshToken = generateRefreshToken(user.id)

    await authRepository.createRefreshToken({ 
        userId: user.id, 
        token: refreshToken, 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    }
    
}

export const refresh = async (data: RefreshTokenData) => {
    const { refreshToken } = data
    const decode = verifyRefreshToken(refreshToken) as {userId: string}

    const storedToken = await authRepository.findRefreshToken(refreshToken)
    if(!storedToken) throw new AppError('Invalid refresh token', 401)

    const user = await authRepository.findUserById(decode.userId)
    if(!user) throw new AppError('User not found', 404)
    
    const accessToken = generateAccessToken(user.id, user.role, user.status)

    return { accessToken }

}

export const logout = async (data: RefreshTokenData) => {
    const { refreshToken } = data
    const findRefreshToken = await authRepository.findRefreshToken(refreshToken)
    if(!findRefreshToken) throw new AppError('Invalid refresh token', 401)

    await authRepository.deleteRefreshToken(refreshToken)
    
    return null
}