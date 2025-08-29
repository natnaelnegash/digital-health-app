const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

// FR3.1: View medical history, lab results, prescriptions
router.post('/records', patientController.getPatientRecords);

// FR3.2: Providers update patient records with audit trails
router.post('/records/update', patientController.updatePatientRecords);

// FR3.3: Import real-time health data from wearable devices
router.post('/wearable/import', patientController.importWearableData);

// FR3.4: Export health records as PDF
router.get('/export-pdf', patientController.exportRecordsToPDF);

module.exports = router;