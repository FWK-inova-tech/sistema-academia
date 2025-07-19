import { Router } from "express";
import { createAluno, getAlunos, getAlunoById, updateAluno, deleteAluno } from "../controllers/AlunoController";
import auth from "../middleware/auth";

const router = Router();

router.post('/', auth, createAluno);
router.get('/', auth, getAlunos);
router.get('/:id', auth, getAlunoById);
router.put('/:id', auth,  updateAluno);
router.delete('/:id', auth, deleteAluno);

export default router;