import { Router } from "express"
import { authMiddlware } from "../middlewares/auth.middleware"
import { authorize } from "../middlewares/role.middleware"
import * as adminController from '../controllers/admin.controller'

const adminRouter = Router()

adminRouter.get('/users', authMiddlware, authorize('ADMIN'), adminController.getUsers)
adminRouter.get('/users/:userId', authMiddlware, authorize('ADMIN'), adminController.getUserById)
adminRouter.patch('/users/status/:userId', authMiddlware, authorize('ADMIN'), adminController.updateStatus)
adminRouter.delete('/users/:userId', authMiddlware, authorize('ADMIN'), adminController.deleteUser)
adminRouter.patch('/users/:userId', authMiddlware, authorize('ADMIN'), adminController.updateUser)
adminRouter.post('/users', authMiddlware, authorize('ADMIN'), adminController.createUser)


export default adminRouter