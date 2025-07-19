import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/UserType';

const UserSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // eslint-disable-next-line no-useless-escape
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido.'] // Validação básica de email
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres.']
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'professor'],
    default: 'user'
  }
}, {
  timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

// Middleware (hook) para criptografar a senha antes de salvar
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Gera um salt
  this.password = await bcrypt.hash(this.password as string, salt); // Hash da senha
  next();
});

// Método para comparar a senha fornecida com a senha criptografada
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exporta o modelo
const User = mongoose.model<IUser>('User', UserSchema);

export default User;