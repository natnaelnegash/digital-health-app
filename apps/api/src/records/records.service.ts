// src/records/records.service.ts
import prisma from '../db';
import { Role } from '@prisma/client';

const createAudit = (tx: any, action: string, performedById: string, patientId: string, record: { id: string, type: string }) => {
  const auditData: any = { action, performedById, patientId };
  if (record.type === 'history') auditData.medicalHistoryId = record.id;
  if (record.type === 'lab') auditData.labResultId = record.id;
  if (record.type === 'prescription') auditData.prescriptionId = record.id;
  return tx.auditTrail.create({ data: auditData });
};

// Service to get all records for a specific patient, for a specific provider
export const getPatientRecords = async (patientUserId: string, providerId: string) => {
  // First, verify the provider has a relationship with the patient
  const relationship = await prisma.appointment.findFirst({
    where: { patientId: patientUserId, providerId },
  });
  if (!relationship) {
    throw new Error('Forbidden: You do not have permission to view this patient\'s records.');
  }

  const patientProfile = await prisma.patient.findUnique({
    where: { userId: patientUserId },
  });
  if (!patientProfile) {
    // This case should ideally not happen if registration is working correctly
    return { medicalHistory: [], labResults: [], prescriptions: [] };
  }
  const patientProfileId = patientProfile.id;

  // If relationship exists, fetch all records
  const [medicalHistory, labResults, prescriptions] = await Promise.all([
    prisma.medicalHistory.findMany({ where: { patientId: patientProfileId } }),
    prisma.labResult.findMany({ where: { patientId: patientProfileId } }),
    prisma.prescription.findMany({ where: { patientId: patientProfileId } }),
  ]);

  return { medicalHistory, labResults, prescriptions };
};

export const createRecord = async (patientUserId: string, providerId: string, recordType: string, data: any) => {
  // Verify relationship
  const relationship = await prisma.appointment.findFirst({ where: { patientId: patientUserId, providerId } });
  if (!relationship) throw new Error('Forbidden: You do not have permission to modify this patient\'s records.');

  const patientProfile = await prisma.patient.findUnique({
    where: { userId: patientUserId },
  });
  if (!patientProfile) {
    throw new Error('Patient profile not found for the given user.');
  }
  const patientProfileId = patientProfile.id; // This is the ID we need to use

  
  return prisma.$transaction(async (tx) => {
    let newRecord;
    switch (recordType) {
      case 'history':
        newRecord = await tx.medicalHistory.create({
          data: { patientId: patientProfileId, details: data.details, date: data.date ? new Date(data.date) : new Date() }
        });
        await createAudit(tx, 'CREATE', providerId, patientUserId, { ...newRecord, type: 'history' });
        break;
      case 'lab':
        newRecord = await tx.labResult.create({
          data: { patientId: patientProfileId, type: data.type, results: { description: data.results }, date: data.date ? new Date(data.date) : new Date() }
        });
        await createAudit(tx, 'CREATE', providerId, patientUserId, { ...newRecord, type: 'lab' });
        break;
      case 'prescription':
        newRecord = await tx.prescription.create({
          data: { patientId: patientProfileId, medication: data.medication, dosage: data.dosage, date: data.date ? new Date(data.date) : new Date() }
        });
        await createAudit(tx, 'CREATE', providerId, patientUserId, { ...newRecord, type: 'prescription' });
        break;
      default:
        throw new Error('Invalid record type');
    }
    const allRecords = await getPatientRecords(patientUserId, providerId);
    console.log(allRecords);
  
  });
};

export const updateMedicalHistory = async (recordId: string, providerId: string, data: any) => {
  const record = await prisma.medicalHistory.findUnique({ where: { id: recordId } });
  if (!record) throw new Error('Record not found');

  // Verify this provider has a relationship with the patient of this record
  const relationship = await prisma.appointment.findFirst({ where: { patientId: record.patientId, providerId } });
  if (!relationship) throw new Error('Forbidden');
  
  return prisma.$transaction(async (tx) => {
    const updatedRecord = await tx.medicalHistory.update({
      where: { id: recordId },
      data: { details: data.details, date: data.date ? new Date(data.date) : undefined },
    });
    await createAudit(tx, 'UPDATE', providerId, record.patientId, { ...updatedRecord, type: 'history' });
    return updatedRecord;
  });
};

// --- We will add the update/create/delete services later to keep this step focused ---