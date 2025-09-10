const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

exports.getPatientRecords = async (req, res) => {
  if (!req.user) {
    console.error('No user in request - authentication failed or middleware not applied');
    return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
  }
  
  const userId = req.user.id;
  try {
    const queryUserId = req.body.userId || userId;
    if (queryUserId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: User ID mismatch' });
    }
    const patient = await prisma.patient.findUnique({
      where: { userId: queryUserId },
      include: {
        medicalHistory: true,
        labResults: true,
        prescriptions: true,
      },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({
      medicalHistory: patient.medicalHistory,
      labResults: patient.labResults,
      prescriptions: patient.prescriptions,
    });
  } catch (error) {
    console.error('Error fetching patient records:', error.message, error.stack);
    res.status(500).json({ error: `Failed to fetch records: ${error.message}` });
  }
};

exports.updatePatientRecords = async (req, res) => {
  if (!req.user) {
    console.error('No user in request - authentication failed or middleware not applied');
    return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
  }
  
  const userId = req.user.id;
  const { patientId, medicalHistory, labResults, prescriptions } = req.body;
  try {
    // Verify user is a provider
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.role !== 'PROVIDER') {
      return res.status(403).json({ error: 'Unauthorized: Only providers can update records' });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Update records and log audit trails
    if (medicalHistory) {
      const record = await prisma.medicalHistory.create({
        data: {
          id: require('crypto').randomUUID(),
          patientId,
          details: medicalHistory.details,
          date: new Date(medicalHistory.date || Date.now()),
        },
      });
      await prisma.auditTrail.create({
        data: {
          id: require('crypto').randomUUID(),
          performedById: userId,
          patientId,
          action: 'CREATE',
          medicalHistoryId: record.id,
          timestamp: new Date(),
        },
      });
    }
    if (labResults) {
      const record = await prisma.labResult.create({
        data: {
          id: require('crypto').randomUUID(),
          patientId,
          type: labResults.type,
          results: labResults.results,
          date: new Date(labResults.date || Date.now()),
        },
      });
      await prisma.auditTrail.create({
        data: {
          id: require('crypto').randomUUID(),
          performedById: userId,
          patientId,
          action: 'CREATE',
          labResultId: record.id,
          timestamp: new Date(),
        },
      });
    }
    if (prescriptions) {
      const record = await prisma.prescription.create({
        data: {
          id: require('crypto').randomUUID(),
          patientId,
          medication: prescriptions.medication,
          dosage: prescriptions.dosage,
          date: new Date(prescriptions.date || Date.now()),
        },
      });
      await prisma.auditTrail.create({
        data: {
          id: require('crypto').randomUUID(),
          performedById: userId,
          patientId,
          action: 'CREATE',
          prescriptionId: record.id,
          timestamp: new Date(),
        },
      });
    }

    res.json({ message: 'Records updated successfully' });
  } catch (error) {
    console.error('Error updating records:', error.message, error.stack);
    res.status(500).json({ error: `Failed to update records: ${error.message}` });
  }
};

exports.importWearableData = async (req, res) => {
  if (!req.user) {
    console.error('No user in request - authentication failed or middleware not applied');
    return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
  }
  
  const userId = req.user.id;
  const { patientId, type, data, date, source } = req.body;
  try {
    // Verify patient access
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient || patient.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Invalid patient access' });
    }

    // Store wearable data as HealthData
    const record = await prisma.healthData.create({
      data: {
        id: require('crypto').randomUUID(),
        userId,
        type: type || 'Wearable Data',
        value: data,
        source: source || 'Unknown',
        date: new Date(date || Date.now()),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.auditTrail.create({
      data: {
        id: require('crypto').randomUUID(),
        performedById: userId,
        patientId,
        action: 'CREATE',
        timestamp: new Date(),
      },
    });

    res.json({ message: 'Wearable data imported successfully', record });
  } catch (error) {
    console.error('Error importing wearable data:', error.message, error.stack);
    res.status(500).json({ error: `Failed to import wearable data: ${error.message}` });
  }
};

exports.exportRecordsToPDF = async (req, res) => {
  if (!req.user) {
    console.error('No user in request - authentication failed or middleware not applied');
    return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
  }
  
  const userId = req.user.id;
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        medicalHistory: true,
        labResults: true,
        prescriptions: true,
      },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const doc = new PDFDocument();
    const exportsDir = path.join(__dirname, 'exports');
    const pdfPath = path.join(exportsDir, `patient-${patient.id}.pdf`);
    await fs.mkdir(exportsDir, { recursive: true });

    const writeStream = require('fs').createWriteStream(pdfPath);
    writeStream.on('error', (err) => {
      console.error('Error writing PDF:', err.message, err.stack);
      if (!res.headersSent) {
        res.status(500).json({ error: `Failed to write PDF: ${err.message}` });
      }
    });

    doc.pipe(writeStream);

    doc.fontSize(16).text('Patient Health Records', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Medical History:');
    if (patient.medicalHistory.length === 0) {
      doc.text('No records available.');
    } else {
      patient.medicalHistory.forEach((item) => {
        doc.text(`- ${item.details} (${new Date(item.date).toLocaleDateString()})`);
      });
    }
    doc.moveDown();
    doc.text('Lab Results:');
    if (patient.labResults.length === 0) {
      doc.text('No records available.');
    } else {
      patient.labResults.forEach((item) => {
        doc.text(`- ${item.type}: ${JSON.stringify(item.results)} (${new Date(item.date).toLocaleDateString()})`);
      });
    }
    doc.moveDown();
    doc.text('Prescriptions:');
    if (patient.prescriptions.length === 0) {
      doc.text('No records available.');
    } else {
      patient.prescriptions.forEach((item) => {
        doc.text(`- ${item.medication} (${item.dosage}) (${new Date(item.date).toLocaleDateString()})`);
      });
    }
    doc.moveDown();
    doc.text('Wearable Health Data:');
    const healthData = await prisma.healthData.findMany({ where: { userId } });
    if (healthData.length === 0) {
      doc.text('No records available.');
    } else {
      healthData.forEach((item) => {
        doc.text(`- ${item.type} (${item.source}): ${JSON.stringify(item.value)} (${new Date(item.date).toLocaleDateString()})`);
      });
    }

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      doc.end();
    });

    res.download(pdfPath, `patient-records-${patient.id}.pdf`, async (err) => {
      if (err) {
        console.error('Error sending PDF:', err.message, err.stack);
        if (!res.headersSent) {
          res.status(500).json({ error: `Failed to export PDF: ${err.message}` });
        }
      } else {
        try {
          await fs.unlink(pdfPath);
        } catch (unlinkErr) {
          console.error('Error deleting PDF:', unlinkErr.message);
        }
      }
    });
  } catch (error) {
    console.error('Error exporting PDF:', error.message, error.stack);
    res.status(500).json({ error: `Failed to export records: ${error.message}` });
  }
};