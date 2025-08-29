const express = require('express');
const providerController = require('../controllers/providerController');

const router = express.Router();

// FR3.2: Update patient records
router.put('/update-record/:patientId', providerController.updatePatientRecord);

module.exports = router;