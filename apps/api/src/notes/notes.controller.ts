import { Request, Response } from "express";
import * as NoteService from './notes.service'
import { Role } from "@prisma/client";

export const getNote = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const note = await NoteService.getNoteForAppointment(id, req.user!.userId, req.user!.role as Role)

        if (!note) {
            return res.status(201).json(null)
        }
        return res.status(201).json(note)
    } catch (error: any) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({message: 'This appointment doenst belong to you'})
        }
        return res.status(500).json({message: error.message || 'Internal server error'})
    }
}

export const createOrUpdate = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const {content} = req.body
        const userRole = req.user!.role
        const providerId = req.user!.userId

        if (userRole !== Role.PROVIDER) {
            return res.status(403).json({message: 'Only provider can create clinical notes'})
        }

        if (!content) {
            return res.status(400).json({message: 'Note is empty and required'})
        }

        const note = await NoteService.createOrUpdateNote(id, content, providerId)
        return res.status(201).json(note)

    } catch (error: any) {
        if (error.message.includes('Forbidden')) {
            return res.status(403).json({message: 'This appointment doenst belong to you'})
        }
        return res.status(500).json({message: error.message || 'Internal server error'})
    }
}