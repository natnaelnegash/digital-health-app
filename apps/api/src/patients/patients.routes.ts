import { Router } from 'express';
import * as PatientController from './patients.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/:id', PatientController.getMyUniquePatientController);

export default router;