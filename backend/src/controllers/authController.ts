import { Request, Response } from 'express';
import User from '../models/User';
import { IUser } from '../types/UserType';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Chave secreta para assinar e verificar o JWT.
const JWT_SECRET = process.env.JWT_SECRET || 'sua_super_chave_secreta_e_longa_aqui';

export const checkToken = async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Token vericado com sucesso" })
}

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    // 1. Verificar se o usuário já existe
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário com este email já existe.' });
    }

    // 2. Criar um novo usuário
    user = await User.create({ email, password, role });

    // Opcional: Gerar token após o registro também
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    // Erros de validação do Mongoose (ex: email inválido, senha curta)
    if (error instanceof mongoose.Error.ValidationError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages = Object.values(error.errors).map(err => (err as any).message);
      return res.status(400).json({ message: 'Erro de validação', errors: messages });
    }
    return res.status(500).json({ message: 'Erro no servidor durante o registro.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Encontrar o usuário pelo email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // 2. Comparar a senha fornecida com a senha criptografada
    // Usamos o método comparePassword definido no schema do User
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Gerar o Token JWT
    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora

    // 4. Enviar o token e informações do usuário (públicas)
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id; // Obtido do middleware 'auth'

  // Validação básica de entrada
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Senha antiga e nova senha são obrigatórias.' });
  }

  if (!userId) {
    // Isso não deve acontecer se o middleware 'auth' estiver funcionando corretamente
    return res.status(401).json({ message: 'ID do usuário não encontrado na requisição. Autorização falhou.' });
  }

  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 1. Verificar a senha antiga
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha antiga incorreta.' });
    }

    user.password = newPassword; // Atribua a nova senha (ela será criptografada automaticamente)
    await user.save(); // Salve o usuário, o hook pre('save') será executado

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });

  } catch (error: unknown) {
    console.error('Erro ao alterar senha:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages = Object.values(error.errors).map(err => (err as any).message);
      return res.status(400).json({ message: 'Erro de validação: ' + messages.join(', ') });
    }
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
    }
    return res.status(500).json({ message: 'Ocorreu um erro desconhecido ao alterar a senha.' });
  }
};
