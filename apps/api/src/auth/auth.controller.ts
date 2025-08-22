import { Request, Response } from "express";
import * as AuthService from './auth.service'
import { log } from "console";
import prisma from "../db";

export const register = async (req: Request, res: Response) => {
    try {
        const {email, password, role} = req.body
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }
        const newUser = await AuthService.registerUser({email, password, role})
        return res.status(201).json(newUser)
    } catch (error: any) {
        if(error.message.includes('already exists')) {
            return res.status(409).json({message: error.message})
        }
        console.log(error)
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }
        const result = await AuthService.loginUser({email, password})
        return res.status(200).json(result)
    } catch (error: any) {
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({message: error.message})
        }
        if (error.message.includes("doesn't exist")) {
            return res.status(401).json({message: error.message})
        }
        return res.status(500).json({message: 'Internal server error'})
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId
        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id:true,
                email:true,
                firstname: true,
                lastname: true,
                role: true
            }
        })

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId
        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        const user = await prisma.user.findMany()

        if (!user) {
            return res.status(404).json({message: 'No users found'})
        }
        
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}