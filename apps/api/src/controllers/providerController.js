const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.updatePatientRecord = async (req, res) => {
  const { patientId } = req.params;
  const { type, id, data } = req.body;
  const providerId = req.user.providerId;

  if (!providerId) {
    return res.status(403).json({ error: 'Only providers can update records' });
  }

  try {
    let updatedRecord;
    let auditData = { action: 'UPDATE', performedBy: providerId };

    if (type === 'history') {
      updatedRecord = await prisma.medicalHistory.update({
        where: { id },
        data: { patientId, ...data },
      });
      auditData.medicalHistoryId = updatedRecord.id;
    } else if (type === 'lab') {
      updatedRecord = await prisma.labResult.update({
        where: { id },
        data: { patientId, ...data },
      });
      auditData.labResultId = updatedRecord.id;
    } else if (type === 'prescription') {
      updatedRecord = await prisma.prescription.update({
        where: { id },
        data: { patientId, ...data },
      });
      auditData.prescriptionId = updatedRecord.id;
    } else {
      return res.status(400).json({ error: 'Invalid record type' });
    }

    await prisma.auditTrail.create({ data: auditData });
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
};