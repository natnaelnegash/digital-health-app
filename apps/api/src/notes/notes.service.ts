import prisma from "../db";
import { Role } from "@prisma/client";

export const getNoteForAppointment = async ( appointmentId: string, userId: string, role: Role) => {
    const note = await prisma.clinicalNote.findUnique({where: {appointmentId: appointmentId}})

    return note
}

export const createOrUpdateNote = async (appointmentId: string , noteContent: string, providerId: string ) => {
    const appointment = await prisma.appointment.findUnique({where: {
        id : appointmentId
    }})
    if (!appointment) {
        throw new Error('Appointment not found')
    }
    if (appointment.providerId !== providerId) {
        throw new Error('Forbidden: Appointment doesnt belong to you')
    }
    const now = new Date()
    if (appointment.status !== "COMPLETED" && now < appointment.startTime) {
        await prisma.appointment.update({
            where: {id: appointmentId},
            data: {
                status: "COMPLETED"
            }
        })
    }

    const note = await prisma.clinicalNote.upsert({
        where: {appointmentId: appointmentId},
        update: {
            note: noteContent
        },
        create: {
            note: noteContent,
            appointmentId: appointmentId,
            providerId: providerId,
            patientId: appointment.patientId
        }
    })
    return note
}