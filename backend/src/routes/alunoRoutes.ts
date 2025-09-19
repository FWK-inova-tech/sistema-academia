import { Router } from "express";
import { createAluno, getAlunos, getAlunoById, updateAluno, deleteAluno, importAlunos, downloadTemplate } from "../controllers/AlunoController";
import auth from "../middleware/auth";
import upload from "../config/multer";

const router = Router();

router.post('/', auth, createAluno);
router.get('/', auth, getAlunos);
router.get('/:id', auth, getAlunoById);
router.put('/:id', auth,  updateAluno);
router.delete('/:id', auth, deleteAluno);
router.post('/import', auth, upload.single('file'), importAlunos);
router.get('/template/download', auth, downloadTemplate);

export default router;