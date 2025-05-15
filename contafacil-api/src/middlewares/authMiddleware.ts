import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verifica se o token de autenticação está presente no cabeçalho
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação não fornecido', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verifica o token com o Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.error(`Erro de autenticação: ${error?.message}`);
      throw new AppError('Token de autenticação inválido', 401);
    }
    
    // Adiciona o ID do usuário ao cabeçalho para uso nos controladores
    req.headers['user-id'] = user.id;
    
    next();
  } catch (error) {
    next(error);
  }
};
