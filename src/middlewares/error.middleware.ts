import { AppError } from "../exceptions/app.error"
import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS } from "../constants/http.status.code"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError){
        return res
        .status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: err.message })
    }

    return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: err.message})
}
