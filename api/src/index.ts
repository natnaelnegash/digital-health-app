import 'dotenv/config';
import express from 'express'
import authRouter from './auth/authRoutes'
import appointmentRouter from './appointments/appointments.routes'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (req: any, res: any) => {
    res.json({status: 'ok', message: 'Welcome to `Digital Health App` API'})
})

app.get('/api/health', (req: any, res: any) => {
    res.json({status: 'ok', message: 'API is healthy'})
})

app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)

app.listen(port, () => {
    console.log(`🚀 API server listening on http://localhost:${port}`)
})