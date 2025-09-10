const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// New function to get patient records by email
exports.getPatientRecordsByEmail = async (req, res) => {
  const { email } = req.params;

  console.log('providerController: Attempting to get records for email:', email);

  // Role check
  if (!req.user || req.user.role.toUpperCase() !== 'PROVIDER') {
    console.log('providerController: Role check failed, role:', req.user?.role);
    return res.status(403).json({ error: 'Only providers can view records' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: {
          include: {
            medicalHistory: true,
            labResults: true,
            prescriptions: true,
          },
        },
      },
    });

    if (!user || !user.patient) {
      console.log('providerController: Patient not found for email:', email);
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = user.patient.id;
    const records = [];

    // Combine all records into a single array with a 'type' field
    if (user.patient.medicalHistory) {
      user.patient.medicalHistory.forEach(record => records.push({ ...record, type: 'history' }));
    }
    if (user.patient.labResults) {
      user.patient.labResults.forEach(record => records.push({ ...record, type: 'lab' }));
    }
    if (user.patient.prescriptions) {
      user.patient.prescriptions.forEach(record => records.push({ ...record, type: 'prescription' }));
    }
    
    // Log the number of records found
    console.log(`providerController: Found ${records.length} records for patient ID: ${patientId}`);
    
    res.json({ patientId, records });
  } catch (error) {
    console.error('providerController: Error getting records by email:', error.message);
    res.status(500).json({ error: 'Failed to retrieve patient records', details: error.message });
  }
};

exports.updatePatientRecord = async (req, res) => {
  const { patientId } = req.params;
  const { type, id, data } = req.body;

  console.log('providerController: req.user:', req.user);
  console.log('providerController: Request body:', req.body);

  // Role check (case-insensitive)
  if (!req.user || req.user.role.toUpperCase() !== 'PROVIDER') {
    console.log('providerController: Role check failed, role:', req.user?.role);
    return res.status(403).json({ error: 'Only providers can update records' });
  }

  try {
    let updatedRecord;
    let auditData = { action: 'UPDATE', performedById: req.user.id, patientId };

    // Convert date to ISO-8601 format if provided
    const formattedDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString();

    if (type === 'history') {
      updatedRecord = await prisma.medicalHistory.update({
        where: { id },
        data: { details: data.details, date: formattedDate },
      });
      auditData.medicalHistoryId = updatedRecord.id;
    } else if (type === 'lab') {
      updatedRecord = await prisma.labResult.update({
        where: { id },
        data: {
          type: data.type || 'lab', // Default type if not provided
          results: { description: data.details }, // Map details to results Json
          date: formattedDate,
        },
      });
      auditData.labResultId = updatedRecord.id;
    } else if (type === 'prescription') {
      updatedRecord = await prisma.prescription.update({
        where: { id },
        data: { medication: data.details, dosage: data.dosage || 'Standard', date: formattedDate },
      });
      auditData.prescriptionId = updatedRecord.id;
    } else {
      return res.status(400).json({ error: 'Invalid record type' });
    }

    await prisma.auditTrail.create({ data: auditData });
    console.log('providerController: Record updated:', updatedRecord);
    res.json(updatedRecord);
  } catch (error) {
    console.error('providerController: Error updating record:', error.message);
    // Return a more user-friendly error message
    let errorMessage = 'Failed to update record.';
    if (error.message.includes('No record was found for `update`')) {
        errorMessage = 'Record not found. It may have been deleted or the ID is incorrect.';
    }
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};