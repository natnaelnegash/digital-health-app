import {email, z} from 'zod'

export const registerSchema = z.object({
    email: z.string().email({message:'Invalid email Address'}),
    password: z.string().min(8,{message: 'Password must be at least 8 characters'})
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().email({message: 'Please enter valid email address'}),
    password: z.string().min(1, {message: 'Password is required'})
})

export type LoginFormValues = z.infer<typeof loginSchema>