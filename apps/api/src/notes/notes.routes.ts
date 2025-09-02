import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import * as NoteController from './notes.controller'

const router = Router({mergeParams: true})

router.use(authMiddleware)

router.get('/', NoteController.getNote)
router.post('/', NoteController.createOrUpdate)

export default router