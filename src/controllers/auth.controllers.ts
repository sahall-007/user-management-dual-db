import { Request, Response } from "express"
import { asyncHandler } from "../utils/async.handler"
import * as authService from '../services/auth.service'
import { HTTP_STATUS } from "../constants/http.status.code"

export const register = asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.register(req.body)
    console.log(response)
    res
    .status(HTTP_STATUS.CREATED)
    .json({ success: true, message: 'register successful', data: response})
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.login(req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: 'Login successful', data: response})
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.refresh(req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: 'Token refreshed', data: response})
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: 'Logout successful' })
})