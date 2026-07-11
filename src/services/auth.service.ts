import { AppError } from '../exceptions/app.error'
import * as authRepository from '../repositories/auth.repository'
import { LoginUserData, RefreshTokenData, RegisterUserData } from '../types/auth.types'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { publishUserEvent } from '../producers/user.producer'
import { EVENTS } from '../constants/event.constants'
import validator from 'validator'

function validate (data: RegisterUserData | LoginUserData) {
    const emailValidate = validator.isEmail(data.email)
    const passwordValidate = validator.matches(data.password, /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Za-z])[A-Za-z0-9!@#$%^&*]{8,15}$/)
    
    if("name" in data){
        const nameValidate = validator.matches(data.name, /^(?=.{3,12}$)[A-Za-z]+(?:[_][A-Za-z]+)*$/)
        if(!nameValidate) throw new AppError('Invalid name format, use letters and _ only', 400)
    }
    if(!emailValidate) throw new AppError('Invalid email format', 400)
    if(!passwordValidate) throw new AppError('Invalid passowrd format, must be between 8 to 15 chars and contain letter, number and special char', 400)

    return true
}

export const register = async (userData: RegisterUserData) => {

    validate(userData)

    const existingUser = await authRepository.findByEmail(userData.email)
    if(existingUser){
        throw new AppError('User already exist', 409)
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await authRepository.createUser({...userData, password: hashedPassword})

    try {
        await publishUserEvent(EVENTS.USER_CREATED, { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            status: user.status, 
        });
    } catch (error) {
        console.error("Failed to publish USER_CREATED event", error);
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }
}

export const login = async (userData: LoginUserData) => {

    validate(userData)

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