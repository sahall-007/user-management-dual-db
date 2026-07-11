import { User } from "../models/mongodb/user.model"
import { RefreshToken } from "../models/mongodb/refreshToken.model"
import { CreateRefreshToken } from "../types/auth.types"

export const createUser = async (userData: object) => {
    return User.create(userData)
}

export const findByEmail = async (email: string) => {
    return User.findOne({ email })
}

export const createRefreshToken = async (data: CreateRefreshToken) => {
    return RefreshToken.create(data)
}

export const findRefreshToken = async (token: string) => {
    return RefreshToken.findOne({ token })
}

export const findUserById = async (userId: string) => {
    return User.findById(userId)
}

export const deleteRefreshToken = async (token: string) => {
    return RefreshToken.deleteOne({token})
}