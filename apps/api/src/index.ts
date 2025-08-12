import express from 'express'
import authRouter from './auth/auth.routes'
import appointmentRouter from './appointments/appointments.routes'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'API is healthy'})
})

app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)

app.listen(port, () => {
    console.log(`🚀 API server listening on http://localhost:${port}`)
})