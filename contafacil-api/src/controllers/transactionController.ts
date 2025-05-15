import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../middlewares/errorHandler';
import { Transaction } from '../types';
import { logger } from '../utils/logger';

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { 
      startDate, 
      endDate, 
      type, 
      accountId, 
      category,
      status,
      limit = 50,
      offset = 0
    } = req.query;

    // Construir a consulta base
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    // Aplicar filtros opcionais
    if (startDate) {
      query = query.gte('date', startDate as string);
    }
    
    if (endDate) {
      query = query.lte('date', endDate as string);
    }
    
    if (type) {
      query = query.eq('type', type as string);
    }
    
    if (accountId) {
      query = query.eq('account_id', accountId as string);
    }
    
    if (category) {
      query = query.eq('category', category as string);
    }
    
    if (status) {
      query = query.eq('status', status as string);
    }

    // Aplicar paginação
    query = query.range(
      Number(offset), 
      Number(offset) + Number(limit) - 1
    );

    // Executar a consulta
    const { data, error, count } = await query;

    if (error) {
      throw new AppError(error.message, 400);
    }

    return res.status(200).json({
      status: 'success',
      data,
      count,
      page: Math.floor(Number(offset) / Number(limit)) + 1,
      limit: Number(limit),
      totalPages: count ? Math.ceil(count / Number(limit)) : 0
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (!data) {
      throw new AppError('Transação não encontrada', 404);
    }

    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    
    // Validar se a conta existe e pertence ao usuário
    const { accountId, destinationAccountId, type } = req.body;
    
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();
    
    if (accountError || !account) {
      throw new AppError('Conta de origem não encontrada ou não pertence ao usuário', 400);
    }
    
    // Se for uma transferência, validar a conta de destino
    if (type === 'TRANSFER' && destinationAccountId) {
      const { data: destAccount, error: destAccountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', destinationAccountId)
        .eq('user_id', userId)
        .single();
      
      if (destAccountError || !destAccount) {
        throw new AppError('Conta de destino não encontrada ou não pertence ao usuário', 400);
      }
    }
    
    // Preparar os dados da transação
    const transactionData: Partial<Transaction> = {
      ...req.body,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Inserir a transação
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) {
      throw new AppError(error.message, 400);
    }
    
    logger.info(`Nova transação criada: ${data.id}`);
    
    return res.status(201).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;
    
    // Verificar se a transação existe e pertence ao usuário
    const { data: existingTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !existingTransaction) {
      throw new AppError('Transação não encontrada', 404);
    }
    
    // Validar contas se foram alteradas
    const { accountId, destinationAccountId, type } = req.body;
    
    if (accountId && accountId !== existingTransaction.accountId) {
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', accountId)
        .eq('user_id', userId)
        .single();
      
      if (accountError || !account) {
        throw new AppError('Conta de origem não encontrada ou não pertence ao usuário', 400);
      }
    }
    
    // Se for uma transferência, validar a conta de destino
    if (type === 'TRANSFER' && destinationAccountId && 
        destinationAccountId !== existingTransaction.destinationAccountId) {
      const { data: destAccount, error: destAccountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', destinationAccountId)
        .eq('user_id', userId)
        .single();
      
      if (destAccountError || !destAccount) {
        throw new AppError('Conta de destino não encontrada ou não pertence ao usuário', 400);
      }
    }
    
    // Preparar os dados para atualização
    const transactionData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    // Atualizar a transação
    const { data, error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      throw new AppError(error.message, 400);
    }
    
    logger.info(`Transação atualizada: ${id}`);
    
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'] as string;
    
    // Verificar se a transação existe e pertence ao usuário
    const { data: existingTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !existingTransaction) {
      throw new AppError('Transação não encontrada', 404);
    }
    
    // Excluir a transação
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      throw new AppError(error.message, 400);
    }
    
    logger.info(`Transação excluída: ${id}`);
    
    return res.status(200).json({
      status: 'success',
      message: 'Transação excluída com sucesso',
    });
  } catch (error) {
    next(error);
  }
};
