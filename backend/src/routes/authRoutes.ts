import { Router } from 'express';
import { register, login } from '../controllers/authController'; // Criaremos esses controladores

const router = Router();

router.post('/register', register); // Rota para registrar um novo usuário
router.post('/login', login);       // Rota para fazer login

export default router;