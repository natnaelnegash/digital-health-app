import { Router } from "express"; 
import { authMiddleware } from "../auth/auth.middleware";
import * as UsersController from './users.controller'

const router = Router()

router.use(authMiddleware)

router.get('/patients/:id', UsersController.getMyUniquePatientController)
router.get('/providers/my-patients', UsersController.getMyPatientsController)
router.get('/providers', UsersController.getAllProviders )
router.get('/provider/:id', UsersController.getProviderById)
router.get('/my-profile',  UsersController.getUserProfile)
router.patch('/update-profile', UsersController.updateUserProfile)

export default router