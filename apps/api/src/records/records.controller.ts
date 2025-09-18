// src/records/records.controller.ts
import { Request, Response } from 'express';
import * as RecordsService from './records.service';
import { Role } from '@prisma/client';
import prisma from '../db'; // We need prisma for the user lookup

export const getRecordsForPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params; // Get patient ID from the URL
    const { userId: providerId, role } = req.user!;

    // Authorization check
    if (role !== Role.PROVIDER) {
      return res.status(403).json({ message: 'Forbidden: Only providers can view records.' });
    }

    const records = await RecordsService.getPatientRecords(patientId, providerId);
    return res.status(200).json(records);

  } catch (error: any) {
    if (error.message.startsWith('Forbidden')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRecordForPatient = async (req: Request, res: Response) => {
  try {
    const { patientId: patientUserId } = req.params;
    const { userId: providerId, role } = req.user!;
    const { type, data } = req.body;

    if (role !== Role.PROVIDER) {
      return res.status(403).json({ message: 'Forbidden: Only providers can create records.' });
    }
    if (!type || !data) {
      return res.status(400).json({ message: 'Record type and data are required.' });
    }

    // console.log("patientId", patientUserId," providerId: ", providerId, "type: ", type, "data: ", data );
    
    const updatedRecords = await RecordsService.createRecord(patientUserId, providerId, type, data);
    // console.log(updatedRecords);
    
    return res.status(201).json(updatedRecords);

    // const newRecord = await RecordsService.createRecord(patientUserId, providerId, type, data);
    // return res.status(201).json(newRecord);

  } catch (error: any) {
    if (error.message.startsWith('Forbidden')) return res.status(403).json({ message: error.message });
    return res.status(500).json({ message: error.message });
  }
};

// --- We will add the update controller later ---