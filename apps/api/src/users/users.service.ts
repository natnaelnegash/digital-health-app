import { JwtPayload } from "../types/express";
import prisma from "../db";
import { Role } from "@prisma/client";

interface UserUpdateData {
    firstname?: string
    lastname?: string
    speciality?: string
    bio?: string
}

interface ProviderFilters {
  search?: string;
  specialty?: string;
}

export const getMyPatients = async (providerId: string) => {
    const appointments = await prisma.appointment.findMany({
        where: {
            providerId: providerId
        },
        include: {
            patient: {
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true
                }
            }
        }
    })
    const patientMap = new Map()
    appointments.forEach((appt) => {
        if (!patientMap.has(appt.patient.id)) {
            patientMap.set(appt.patient.id, appt.patient)
        }
    })
    const uniquePatients = Array.from(patientMap.values())
    return uniquePatients
}

export const getProviderById = async (providerId: string) => {
    const provider = await prisma.user.findUnique({where: {
        id: providerId, role: Role.PROVIDER
    }, select: {
        id: true, email:true, 
        firstname: true, 
        lastname: true,
        speciality: true,
        bio: true,
        role: true
    }})
    if (!provider) {
        throw new Error('Provider not found')
    }
    return provider
}

export const getAllProviders = async (user: JwtPayload, filters: ProviderFilters) => {
    const {search, specialty} = filters
    const whereClause: any = {
        role: Role.PROVIDER
    }
    if (search) {
        whereClause.OR = [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        ];
    }
    if(specialty) {
        whereClause.speciality = specialty
    }

    const providers = await prisma.user.findMany({where: whereClause, select:{
        id: true,
        firstname: true,
        lastname:true,
        email: true,
        speciality: true,
        bio: true
    }, orderBy: {
        lastname: 'asc'
    }})

    if (!providers) {
        throw new Error('No providers found')
    }

    return providers
}

export const getUserProfile = async (user: JwtPayload) => {
    const {userId} = user
    const userProfile = await prisma.user.findUnique({where: {id: userId}, select: {
        id: true,
        email : true,
        firstname: true,
        lastname: true,
        speciality: true,
        bio: true,
        role: true
    }})
    if (!user) {
        throw new Error('User not found')
    }

    return userProfile
}

export const updateUserProfile = async (userId: string, role: Role, data: UserUpdateData) => {
    const dataToUpdate: any = {
        firstname : data.firstname,
        lastname : data.lastname,
    }

    if (role === Role.PROVIDER) {
        dataToUpdate.speciality = data.speciality
        dataToUpdate.bio = data.bio
    }
    const updatedUser = await prisma.user.update({
        where: {id : userId}, 
        data: dataToUpdate,
        select: {
            id: true,
            email : true,
            firstname: true,
            lastname: true,
            role: true
    }})
    if(!updatedUser) {
        throw new Error("Couldn't update user profile")
    }

    return updatedUser
}