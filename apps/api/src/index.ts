import express from 'express'
import authRouter from './auth/auth.routes'
import appointmentRouter from './appointments/appointments.routes'
import userRouter from './users/user.routes'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'API is healthy'})
})

app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
    console.log(`🚀 API server listening on http://localhost:${port}`)
})