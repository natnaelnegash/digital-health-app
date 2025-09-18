// src/records/records.routes.ts
import { Router } from 'express';
import * as RecordsController from './records.controller';
import { authMiddleware } from '../auth/auth.middleware';

// This router will be nested under a patient ID
const router = Router({ mergeParams: true });

router.use(authMiddleware);

// This will correspond to GET /api/patients/:patientId/records
router.get('/', RecordsController.getRecordsForPatient);
router.post('/', RecordsController.createRecordForPatient);

// We will add POST, PATCH, DELETE routes here later

export default router;