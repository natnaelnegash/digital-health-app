import { Request , Response } from "express";
import * as UsersService  from "./users.service";
import { Role } from "@prisma/client";

export const getProviderById = async (req: Request, res: Response) => {
    const providerId = req.params.id
    try {
        const provider = await UsersService.getProviderById(providerId)
        return res.status(200).json(provider)
    } catch (error: any) {
        res.status(500).json({message: error.message || 'Internal server error'})
    }
}

export const getAllProviders = async (req : Request, res: Response) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({message: 'Unauthorized'})
    }
    try {
        const providers = await UsersService.getAllProviders(user)
        return res.status(201).json(providers)
    } catch (error: any) {
        if(error.message.includes('No providers found')) {
            return res.status(404).json(error.message)
        }
        return res.status(500).json({message: 'Internal serer error'})
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    try {
        const userProfile = await UsersService.getUserProfile(user)
        return res.status(201).json(userProfile)
    } catch (error: any) {
        if (error.message.includes('User not found')) {
            return res.status(404).json(error.message || 'User not found')
        }
        return res.status(404).json(error.message || 'Internal server error')
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    const {userId, role} = req.user!

    if (!userId) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const {firstname, lastname, speciality, bio}= req.body

    try {
        const userProfile = await UsersService.updateUserProfile(userId, role as Role, {firstname,lastname,speciality,bio})
        return res.status(201).json(userProfile)
    } catch (error: any) {
        if (error.message.includes("Couldn't update user profile")) {
            return res.status(404).json(error.message || "Couldn't update user profile")
        }
        return res.status(404).json(error.message || 'Internal server error')
    }
}