import { EVENTS } from '../constants/event.constants'
import { HTTP_STATUS } from '../constants/http.status.code'
import { AppError } from '../exceptions/app.error'
import { publishUserEvent } from '../producers/user.producer'
import * as adminRepository from '../repositories/admin.repository'
import * as authRepository from '../repositories/auth.repository'
import { CreateUserData, updateUserdata, updateUserStatusData } from '../types/admin.types'
import bcrypt from 'bcrypt'

export const getUsers = async () => {
    return await adminRepository.findUsers()
}

export const getUserById = async (userId: string) => {
    const user = await adminRepository.findById(userId)
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }
}

export const deleteUser = async (userId: string) => {
    const existingUser = await adminRepository.findById(userId)
    if (!existingUser) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    if (existingUser.role === 'ADMIN') throw new AppError('Admins cannot be deleted', HTTP_STATUS.FORBIDDEN)

    const user = await adminRepository.deleteUser(userId)
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)

    try {
        await publishUserEvent(EVENTS.USER_DELETED, { id: userId, });
    } catch (error) {
        console.error("Failed to publish USER_DELETED event", error);
    }

    return null
}

export const updateStatus = async (userId: string, data: updateUserStatusData) => {
    const user = await adminRepository.updateUserStatus(userId, data)
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
        

    try {
        await publishUserEvent(EVENTS.USER_STATUS_UPDATED, { id: user.id, status: user.status, })
    } catch (error) {
        console.error("Failed to publish USER_STATUS_UPDATED event", error)
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }
}

export const updateUser = async (userId: string, data: updateUserdata) => {
    const user = await adminRepository.updateUser(userId, data)
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)

    try {
        await publishUserEvent(EVENTS.USER_UPDATED, { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, });
    } catch (error) {
        console.error("Failed to publish USER_UPDATED event", error);
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }

}

export const createUser = async (data: CreateUserData) => {
    const existingUser = await authRepository.findByEmail(data.email)
    if (existingUser) throw new AppError('Email already exist', HTTP_STATUS.CONFLICT)

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await authRepository.createUser({ ...data, password: hashedPassword })

    try {
        await publishUserEvent(EVENTS.USER_CREATED, { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, });
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

