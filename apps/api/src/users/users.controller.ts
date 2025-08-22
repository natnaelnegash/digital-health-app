import { Request , Response } from "express";
import * as UsersService  from "./users.service";

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