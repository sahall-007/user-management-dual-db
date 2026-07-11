import { Request, Response } from "express"
import { asyncHandler } from "../utils/async.handler"
import * as adminService from '../services/admin.service'
import { HTTP_STATUS } from "../constants/http.status.code"
import { IParams } from "../types/admin.types"

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const response = await adminService.getUsers()

    res
    .status(HTTP_STATUS.OK)
    .json({success: true, data: response})
})

export const getUserById = asyncHandler(async (req: Request<IParams>, res: Response) => {
    const response = await adminService.getUserById(req.params.userId)

    res
    .status(HTTP_STATUS.OK)
    .json({success: true, data: response})
})

export const deleteUser = asyncHandler(async (req: Request<IParams>, res: Response) => {
    await adminService.deleteUser(req.params.userId)

    res
    .status(HTTP_STATUS.OK)
    .json({success: true, message: 'User deleted successfully'})
})

export const updateStatus = asyncHandler(async (req: Request<IParams>, res: Response) => {
    const response = await adminService.updateStatus(req.params.userId, req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({success: true, message: 'User status updated', data: response})
})

export const updateUser = asyncHandler(async (req: Request<IParams>, res: Response) => {
    const response = await adminService.updateUser(req.params.userId, req.body)

    res
    .status(HTTP_STATUS.OK)
    .json({success: true, message: 'User updated successfully', data: response})
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const response = await adminService.createUser(req.body)

    res
    .status(HTTP_STATUS.CREATED)
    .json({success: true, message: 'User created successfully', data: response})
})

