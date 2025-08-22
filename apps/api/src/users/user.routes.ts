import { Router } from "express"; 
import { authMiddleware } from "../auth/auth.middleware";
import * as UsersController from './users.controller'

const router = Router()

router.get('/providers',authMiddleware, UsersController.getAllProviders )

export default router