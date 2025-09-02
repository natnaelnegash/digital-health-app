import { JwtPayload } from "../types/express";
import prisma from "../db";
import { Role } from "@prisma/client";

interface UserUpdateData {
    firstname?: string
    lastname?: string
    speciality?: string
    bio?: string
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

export const getAllProviders = async (user: JwtPayload) => {
    const providers = await prisma.user.findMany({where: {
        role : Role.PROVIDER
    }, select:{
        id: true,
        firstname: true,
        lastname:true,
        email: true
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