import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estenda a interface Request do Express para incluir o user.id
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Chave secreta para assinar e verificar o JWT
const JWT_SECRET = process.env.JWT_SECRET || 'sua_super_chave_secreta_e_longa_aqui';

const auth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Obter o token do cabeçalho
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Nenhum token fornecido, autorização negada.' });
  }

  // O token geralmente vem no formato "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido, autorização negada.' });
  }

  try {
    // 2. Verificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // 3. Anexar o ID do usuário ao objeto de requisição
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado.' });
    }
     return res.status(401).json({ message: 'Token inválido, autorização negada.' });
  }
};

export default auth;