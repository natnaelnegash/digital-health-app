import prisma from "../db";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import {User} from '@prisma/client'

export const registerUser = async (userData: Pick<User, 'email' | 'password' | 'role'>) => {
    const {email, password, role} = userData
    const existingUser = await prisma.user.findUnique({where: {email}})
    if (existingUser) {
        throw new Error('User with this email already exists.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email, 
            password: hashedPassword,
            role
        }
    })

    const {password: _, ...userWithoutPassword} = newUser
    return userWithoutPassword
}

export const loginUser = async (loginData: Pick<User, 'email' | 'password'>) => {
    const {email, password} = loginData

    const user = await prisma.user.findUnique({where: {email}})
    if(!user) {
        throw new Error("User doesn't exist")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error('Invalid credentials')
    }
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET!,
        {expiresIn: '1d'}
    )
    return {token}
}