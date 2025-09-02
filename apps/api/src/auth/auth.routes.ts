import { Router } from "express";
import * as AuthController from './auth.controller'
import { authMiddleware } from "./auth.middleware";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.get('/profile', authMiddleware, AuthController.getProfile)
router.get('/users', authMiddleware, AuthController.getUsers)

export default router