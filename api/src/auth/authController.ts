import { Request, Response } from "express";
import * as AuthService from './authService';
import prisma from "../db";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendPasswordResetEmail } from '../utils/sendEmail';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import { comparePassword } from '../utils/comparePassword';
import { generatePasswordResetToken } from '../utils/generateToken';

// Define CustomRequest type to include user property
export interface CustomRequest extends Request {
    user?: {
        userId: string;
        id?: string;
        email: string;
        role: string;
        isConfirmed?: boolean;
    };
}

// === USER REGISTRATION ===
export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const newUser = await AuthService.registerUser({ email, password, firstname,lastname });
        return res.status(201).json(newUser);
    } catch (error: any) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// === USER LOGIN ===
export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await AuthService.loginUser({ email, password });
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message.includes('Invalid credentials') || error.message.includes("doesn't exist")) {
            return res.status(401).json({ message: error.message });
        }
        console.log(error);
        return res.status(500).json({success:false,  message: 'Internal server error', error: error.message });
    }
};

// === GET USER PROFILE ===
export const getProfile = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// === LOGOUT ===
export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.clearCookie('token');
        req.headers['authorization'] = '';
        return res.status(204).json({ success: true, message: "Successfully logged out." });
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(500).json({ success: false, message: err.message, stack: err.stack });
        }
        return res.status(500).json({ success: false, message: 'An unknown error occurred.' });
    }
};

// === DELETE USER ACCOUNT ===
export const deleteAccount = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await prisma.user.delete({ where: { id: user.id } });

        res.clearCookie('token');
        req.headers['authorization'] = '';
        return res.status(200).json({ success: true, message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};
