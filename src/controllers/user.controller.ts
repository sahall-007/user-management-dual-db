import { Request, Response } from "express"
import { asyncHandler } from "../utils/async.handler"
import * as userService from '../services/user.service'
import { HTTP_STATUS } from "../constants/http.status.code"

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const response = await userService.getProfile(req.user!.userId)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, data: response})
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const response = await userService.updateProfile(req.user!.userId, req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: 'Profile updated successfully', data: response})
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    await userService.changePassword(req.user!.userId, req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: 'Password changed successfully'})
})