import { Router } from "express"
import { authMiddlware } from "../middlewares/auth.middleware"
import * as userController from '../controllers/user.controller'

const userRouter = Router()

userRouter.get('/me', authMiddlware, userController.getProfile)
userRouter.patch('/me', authMiddlware, userController.updateProfile)
userRouter.patch('/change-password', authMiddlware, userController.changePassword)


export default userRouter