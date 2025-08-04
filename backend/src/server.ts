import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import alunoRoutes from './routes/alunoRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();

connectDB();

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'https://sistema-academia.vercel.app', // Se fizer deploy no Vercel
  'https://sistema-academia.netlify.app', // Se fizer deploy no Netlify
];

if (process.env.APP_URL) {
  allowedOrigins.push(process.env.APP_URL);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));
app.use(express.json());

//Rotas
app.use('/api/alunos', alunoRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
