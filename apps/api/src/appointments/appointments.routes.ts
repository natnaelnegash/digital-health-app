import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import * as AppointmentController from "./appointments.controller";
import noteRouter from '../notes/notes.routes'

const router = Router()
router.use(authMiddleware)

router.post('/', AppointmentController.createAppointment)
router.get('/', AppointmentController.getAll)
router.get('/:id', AppointmentController.getById)
router.patch('/:id/cancel', AppointmentController.cancelAppointment)

router.use('/:id/note', noteRouter)

export default router