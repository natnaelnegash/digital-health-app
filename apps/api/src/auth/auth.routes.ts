import { Router } from "express";
import * as AuthController from './auth.controller'
import { authMiddleware } from "./auth.middleware";

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/profile', authMiddleware, AuthController.getProfile)

export default router