import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS } from "../constants/http.status.code"

export const authorize = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res
            .status(HTTP_STATUS.UNAUTHORIZED)
            .json({ success: false, message: "Unauthorized" })
        }
        if (role.toUpperCase() != req.user.role.toUpperCase()) {
            return res
            .status(HTTP_STATUS.FORBIDDEN)
            .json({ success: false, message: "Forbidden" })
        }
        next()
    }
}