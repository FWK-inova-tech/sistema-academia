import { Document } from 'mongoose';

export interface UserType {
  email: string;
  password?: string;
  role?: 'admin' | 'user' | 'professor';
  // Adicione outros campos que você precise para o usuário (ex: nome, sobrenome)
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para o documento Mongoose que estende a UserType e Document
export interface IUser extends UserType, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}