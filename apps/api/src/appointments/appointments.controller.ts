import { Request, Response } from "express";
import * as AppointmentService from './appointments.service'
import prisma from "../db";

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const user = req.user
    if (!user) {
        return res.status(401).json({message: 'Unauthorized user'})
    }

    const cancelled = await AppointmentService.cancelAppointment(id, user)
    return res.status(201).json(cancelled)

    } catch (error: any) {
        if (error.message.startsWith('Not Found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.startsWith('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.startsWith('Bad Request')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error'})
    }
}

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const patientId = req.user?.userId
        const {providerId, startTime, reason} = req.body

        if (!patientId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!providerId || !startTime) {
            return res.status(400).json({ message: 'Provider ID and start time are required.' });
        }
        const appointmentData = {patientId, providerId, startTime, reason}
        const newAppointment = await AppointmentService.createAppointment(appointmentData)
        return res.status(201).json(newAppointment)
    } catch (error: any) {
            return res.status(400).json({message: error.message})
    }
}

export const getAll = async (req:Request, res: Response) => {
    try {
        const user = req.user
        

        if (!user) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        const appointment = await AppointmentService.getAppointmentsForUser(user)
        return res.status(200).json(appointment)
    } catch (error: any) {
        return res.status(500).json({message: 'Internal server error'})
    }
}