import express from 'express'
import authRouter from './auth/auth.routes'
import appointmentRouter from './appointments/appointments.routes'
import userRouter from './users/user.routes'
import noteRouter from './notes/notes.routes'
import patientRouter from './patients/patients.routes'
import recordsRouter from './records/records.routes';
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'API is healthy'})
})


app.use('/api/appointments', appointmentRouter)
appointmentRouter.use('/:appointmentId/note', noteRouter);

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/patients', patientRouter)

patientRouter.use('/:patientId/records', recordsRouter);

app.listen(port, () => {
    console.log(`🚀 API server listening on http://localhost:${port}`)
})