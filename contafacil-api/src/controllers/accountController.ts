import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../middlewares/errorHandler';
import { Account } from '../types';
import { logger } from '../utils/logger';

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('userId', userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (!data) {
      throw new AppError('Conta não encontrada', 404);
    }

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const accountData: Partial<Account> = {
      ...req.body,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('accounts')
      .insert(accountData)
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    logger.info(`Nova conta criada: ${data.id}`);

    return res.status(201).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Verificar se a conta existe e pertence ao usuário
    const { data: existingAccount, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    if (fetchError || !existingAccount) {
      throw new AppError('Conta não encontrada', 404);
    }

    const accountData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .eq('userId', userId)
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    logger.info(`Conta atualizada: ${id}`);

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Verificar se a conta existe e pertence ao usuário
    const { data: existingAccount, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    if (fetchError || !existingAccount) {
      throw new AppError('Conta não encontrada', 404);
    }

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

    if (error) {
      throw new AppError(error.message, 400);
    }

    logger.info(`Conta excluída: ${id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Conta excluída com sucesso',
    });
  } catch (error) {
    next(error);
  }
};
