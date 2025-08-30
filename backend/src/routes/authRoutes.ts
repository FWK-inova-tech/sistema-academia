import { Router } from 'express';
import { register, login, changePassword, checkToken } from '../controllers/authController'; // Criaremos esses controladores
import auth from '../middleware/auth';

const router = Router();

router.post('/register', register); // Rota para registrar um novo usuário
router.post('/login', login);       // Rota para fazer login
router.put('/change-password', auth, changePassword); // Rota para alterar senha, PROTEGIDA pelo middleware 'auth'
router.get('/check-token', auth, checkToken) // rota para checar o token

export default router;
