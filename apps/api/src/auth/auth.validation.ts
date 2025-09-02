import { z} from 'zod'

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email({message: "A valid email address is required"}),
        password: z.string().min(8, {message: 'Password must be at least 8 characters long'})
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email({message: "A valid email address is required"}),
        password: z.string().min(1, {message: 'Password is required'})
    })
})