import { Router } from 'express';
import * as PatientController from './patients.controller';
import { authMiddleware } from '../auth/auth.middleware';
import recordsRouter from '../records/records.routes';

const router = Router();

router.use(authMiddleware);

router.get('/:id', PatientController.getMyUniquePatientController);

router.use('/:patientId/records', recordsRouter);

export default router;