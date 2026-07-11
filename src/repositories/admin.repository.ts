import { User } from "../models/mongodb/user.model"
import { updateUserdata, updateUserStatusData } from "../types/admin.types"

export const findUsers = async () => {    
    return User.find()
}

export const findById = async (userId: string) => {
    return User.findById(userId)
}

export const deleteUser = async (userId: string) => {
    return User.findByIdAndDelete(userId)
}

export const updateUserStatus = async (userId: string, data: updateUserStatusData) => {
    return User.findByIdAndUpdate(userId, {status: data.status}, { new: true })
}

export const updateUser = async (userId: string, data: updateUserdata) => {
    return User.findByIdAndUpdate(userId, data, {new: true})
}