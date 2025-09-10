const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const prisma = new PrismaClient();

const router = express.Router();

// FR3.1: Patient can view health records
// This route is called by the Patient Dashboard to fetch their records.
router.get('/records', async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const medicalHistory = await prisma.medicalHistory.findMany({
      where: { patient: { userId } },
    });
    
    const labResults = await prisma.labResult.findMany({
      where: { patient: { userId } },
    });
    
    const prescriptions = await prisma.prescription.findMany({
      where: { patient: { userId } },
    });

    const allRecords = [
      ...medicalHistory.map(rec => ({ ...rec, type: 'history' })),
      ...labResults.map(rec => ({ ...rec, type: 'lab' })),
      ...prescriptions.map(rec => ({ ...rec, type: 'prescription' })),
    ];
    
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('Patient records fetched successfully.');
    res.json(allRecords);
  } catch (error) {
    console.error('Failed to fetch patient records:', error);
    res.status(500).json({ error: 'Failed to fetch patient records', details: error.message });
  }
});

// FR2.3: Patient can view upcoming appointments
// This route is called by the Patient Dashboard to fetch their appointments.
router.get('/appointments', async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: userId,
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        provider: {
          select: { firstname: true, lastname: true },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    console.log('Patient appointments fetched successfully.');
    res.json(appointments);
  } catch (error) {
    console.error('Failed to fetch patient appointments:', error);
    res.status(500).json({ error: 'Failed to fetch patient appointments', details: error.message });
  }
});

// FR3.4: Export health records as PDF
// This new route generates and sends a PDF of the patient's records.
router.get('/export-pdf', async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstname: true, lastname: true, email: true },
    });
    
    const medicalHistory = await prisma.medicalHistory.findMany({ where: { patient: { userId } } });
    const labResults = await prisma.labResult.findMany({ where: { patient: { userId } } });
    const prescriptions = await prisma.prescription.findMany({ where: { patient: { userId } } });

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let y = height - 50;
    const margin = 50;
    const fontSize = 12;

    const drawText = (text, x, size = fontSize, isBold = false) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? timesRomanFont : timesRomanFont,
        color: rgb(0, 0, 0),
      });
      y -= size * 1.5;
    };

    drawText('Patient Health Records', margin, 18, true);
    drawText(`Name: ${user.firstname} ${user.lastname}`, margin);
    drawText(`Email: ${user.email}`, margin);
    y -= 20;

    // Add Medical History section
    drawText('Medical History', margin, 14, true);
    if (medicalHistory.length > 0) {
      medicalHistory.forEach(rec => {
        drawText(`- Date: ${new Date(rec.date).toLocaleDateString()}, Details: ${rec.details}`, margin + 10);
      });
    } else {
      drawText('No medical history records found.', margin + 10);
    }
    y -= 20;

    // Add Lab Results section
    drawText('Lab Results', margin, 14, true);
    if (labResults.length > 0) {
      labResults.forEach(rec => {
        drawText(`- Date: ${new Date(rec.date).toLocaleDateString()}, Type: ${rec.type}, Results: ${rec.results.description || 'N/A'}`, margin + 10);
      });
    } else {
      drawText('No lab results found.', margin + 10);
    }
    y -= 20;

    // Add Prescriptions section
    drawText('Prescriptions', margin, 14, true);
    if (prescriptions.length > 0) {
      prescriptions.forEach(rec => {
        drawText(`- Date: ${new Date(rec.date).toLocaleDateString()}, Medication: ${rec.medication}, Dosage: ${rec.dosage}`, margin + 10);
      });
    } else {
      drawText('No prescriptions found.', margin + 10);
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="health_records.pdf"');
    res.send(Buffer.from(pdfBytes));
    
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

module.exports = router;