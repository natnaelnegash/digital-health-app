import { Router } from "express";
import * as AuthController from './authController'
import { authMiddleware } from "./authMiddleware";

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/profile', authMiddleware, AuthController.getProfile)

export default router