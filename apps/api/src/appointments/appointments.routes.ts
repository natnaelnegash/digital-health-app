import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import * as AppointmentController from "./appointments.controller";

const router = Router()
router.use(authMiddleware)

router.post('/', AppointmentController.createAppointment)
router.get('/', AppointmentController.getAll)
router.patch('/:id/cancel', AppointmentController.cancelAppointment)

export default router