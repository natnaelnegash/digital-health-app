import prisma from "../db";
import { AppointmentStatus, Role } from "@prisma/client";
import { JwtPayload } from "../types/express";

interface AppointmentData {
    patientId: string
    providerId: string
    startTime: string
    reason: string
}

export const cancelAppointment = async (appointmentId: string, user: JwtPayload) => {
    const {userId, role} = user

    const appointment = await prisma.appointment.findUnique({where: {id: appointmentId}})

    if (!appointment) {
        throw new Error('Not Found: Appointment not found')
    }

    const isPatient = role === Role.PATIENT && appointment.patientId === user.userId
    const isProvider = role == Role.PROVIDER && appointment.providerId === user.userId
    const isAdmin = role == Role.ADMIN

    if(!isPatient && !isProvider && !isAdmin) {
        throw new Error('Forbidden: You do not have permission to cancel this appointment.')
    }

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
        throw new Error(`Bad Request: Appointment can't be cancelled with status ${appointment.status}` )
    }

    const updatedAppointment = await prisma.appointment.update({where: {id: appointmentId}, data: {status: AppointmentStatus.CANCELLED}})
    return updatedAppointment
}

export const createAppointment = async (data: AppointmentData) => {
    const {patientId, providerId, startTime, reason} = data

    if (patientId === providerId) {
        throw new Error("Patient and provider can't be the same")
    } 

    const provider = await prisma.user.findUnique({where: {id:providerId}})
    if (!provider || provider.role !== "PROVIDER") {
        throw new Error("Invalid provider ID")
    }

    const appontmentStartTime = new Date(startTime)
    const appontmentEndTime = new Date(appontmentStartTime.getTime() + 30*60*1000)

    const existingAppointment = await prisma.appointment.findFirst({where: {providerId, startTime:appontmentStartTime}})
    if (existingAppointment) {
        throw new Error('Provider is already booked at this time')
    }

    const newAppointment = await prisma.appointment.create({
        data: {
            startTime: appontmentStartTime,
            endTime: appontmentEndTime,
            reason: reason,
            patientId: patientId,
            providerId: providerId
        }
    })
    return newAppointment
}

export const getAppointmentsForUser = async (user: JwtPayload) => {
    const {userId, role} = user

    const query: any = {
        where: {
        },
        include: {
            patient: {
                select: {id: true, firstname: true, lastname: true, email: true}
            },
            provider: {
                select: {id: true, firstname: true, lastname: true, email: true}
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    }

    if (role === Role.PATIENT) {
        query.where.patientId = userId
    }
    else if (role === Role.PROVIDER) {
        query.where.providerId = userId
    }
    else if (role !== Role.ADMIN) {
        return []
    }

    const appointments = await prisma.appointment.findMany(query)
    return appointments
}

export const getAppointmentById = async (appointmentId: string, user: JwtPayload) => {
    const {userId} = user

    const appointment = await prisma.appointment.findUnique({where: {id: appointmentId}, include: {
        patient: {
            select: {id: true, firstname: true, lastname: true, email: true}
        },
        provider: {
            select: {id: true, firstname: true, lastname: true, email: true}
        },
    }})

    if(!appointment) {
        throw new Error('Not Found: Appointment doesnt exist')
    }

    const isPatient = user.role === 'PATIENT' && appointment.patientId === user.userId;
    const isProvider = user.role === 'PROVIDER' && appointment.providerId === user.userId;
    const isAdmin = user.role === 'ADMIN';

    if (!isPatient && !isProvider && !isAdmin) {
        throw new Error('Forbidden: You do not have permission to view this appointment.');
    }

    return appointment;
}