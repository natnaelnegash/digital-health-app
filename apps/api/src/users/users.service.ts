import { JwtPayload } from "../types/express";
import prisma from "../db";
import { Role } from "@prisma/client";

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