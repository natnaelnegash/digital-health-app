import prisma from "../db"

export const getMyUniquePatient = async (patientId: string, providerId: string) => {
    
    const relationship = await prisma.appointment.findFirst({
        where: {
            patientId: patientId,
            providerId: providerId
        },
    })

    if (!relationship) {
        throw new Error('Forbidden: You do not have a professional relationship with this patient.')
    }

    const myPatient = await prisma.user.findUnique({
        where: {
            id: patientId
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true
        }
    })
    if (!myPatient) {
    throw new Error('Not Found: Patient does not exist.');
  }
    const appointments = await prisma.appointment.findMany({
        where: {
            patientId : patientId,
            providerId: providerId
        },
        select: {
            id: true,
            startTime: true,
            reason: true,
            status: true,
        },
        orderBy: {
            startTime: 'desc'
        }
    })
    return [myPatient, appointments]
}