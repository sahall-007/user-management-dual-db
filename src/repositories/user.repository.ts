import { User } from "../models/mongodb/user.model"

export const updateProfile = async (userId: string, updateData: Object) => {
    return User.findByIdAndUpdate(userId, updateData, {new: true})
}

export const changePassword = async (userId: string, password: string) => {
    return User.findByIdAndUpdate(userId, {password}, { new: true })
}

