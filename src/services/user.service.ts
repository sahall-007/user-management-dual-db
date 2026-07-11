import { HTTP_STATUS } from '../constants/http.status.code'
import { AppError } from '../exceptions/app.error'
import bcrypt from 'bcrypt'
import * as userRepository from '../repositories/user.repository'
import * as adminRepository from '../repositories/admin.repository'
import { ChangePasswordData } from '../types/auth.types'

export const getProfile = async (userId: string) => {
    const user = await adminRepository.findById(userId)
    if(!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }
}

export const updateProfile = async (userId: string, updateData: {name: string}) => {
    const updatedUser = await userRepository.updateProfile(userId, updateData)
    if(!updatedUser) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    
    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status
    }
} 

export const changePassword = async (userId: string, data: ChangePasswordData) => {
    const user = await adminRepository.findById(userId)
    if(!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    
    const compare = await bcrypt.compare(data.currentPassword, user.password)
    if(!compare) throw new AppError('Current password in incorrect', HTTP_STATUS.UNAUTHORIZED)
    
    const hashedPassword = await bcrypt.hash(data.newPassword, 10)
    await userRepository.changePassword(userId, hashedPassword)

    return null
}
