import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import alunoRoutes from './routes/alunoRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();

connectDB();
const corsOptions = {
  origin: process.env.APP_URL,
  credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());

//Rotas
app.use('/api/alunos', alunoRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
