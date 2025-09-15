import prisma from "../db";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import {User} from '@prisma/client'

export const registerUser = async (userData: Pick<User, 'email' | 'password' | 'firstname' | 'lastname' | 'role'>) => {
    const {email, password, firstname, lastname, role} = userData
    const existingUser = await prisma.user.findUnique({where: {email}})
    if (existingUser) {
        throw new Error('User with this email already exists.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email, 
            password: hashedPassword,
            firstname,
            lastname,
            role
        }
    })

    const {password: _, ...userWithoutPassword} = newUser
    
    const token = jwt.sign(
        {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role
        },
        process.env.JWT_SECRET!,
        {expiresIn: '1d'}
    )
    const userDetail = {email: newUser.email, role: newUser.role}
    return {userDetail, token}
    // return userWithoutPassword
}

export const loginUser = async (loginData: Pick<User, 'email' | 'password'>) => {
    const {email, password} = loginData

    const user = await prisma.user.findUnique({where: {email}})
    // console.log("\n\n\nuser\n\n\n", user)
    
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
    const userDetail = {email: user.email, role: user.role}
    return {userDetail, token}
}