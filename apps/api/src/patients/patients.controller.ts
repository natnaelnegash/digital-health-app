import { Request , Response } from "express";
import * as UsersService  from "./patients.service";
import { Role } from "@prisma/client";

export const getMyUniquePatientController = async (req: Request, res: Response) => {
    try {
        const {userId, role}  = req.user!
        const patientId = req.params.id
    
        if (role !== Role.PROVIDER) {
        return res.status(403).json({ message: 'Forbidden: Only providers can access this resource.' });
        }
        const [myPatient, appointments] = await UsersService.getMyUniquePatient(patientId, userId)
        return res.status(203).json({patient: myPatient, appointments: appointments})
    } catch (error: any) {
        if (error.message.startsWith('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.startsWith('Not Found')) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
  }
    }
