import { Request, Response, NextFunction } from "express"
import { HTTP_STATUS } from "../constants/http.status.code"
import { verifyAccessToken } from "../utils/jwt"
 

export const authMiddlware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ succuss: false, message: 'Access token required'})
    }
    
    const token = authHeader.split(" ")[1]
    if(!token){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Invalid token'})
    }

    try{
        const decode = verifyAccessToken(token) as { userId: string, role: string}
        req.user = {userId: decode.userId, role: decode.role}

        next()
    }
    catch(err){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }
}


