import prisma from "../db";
import { Role } from "@prisma/client";
import { JwtPayload } from "../types/express";

interface AppointmentData {
    patientId: string
    providerId: string
    startTime: string
    reason: string
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