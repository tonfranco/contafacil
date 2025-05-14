import { Router } from 'express';
import accountRoutes from './accountRoutes';
import transactionRoutes from './transactionRoutes';
import budgetRoutes from './budgetRoutes';
import goalRoutes from './goalRoutes';
import reportRoutes from './reportRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);

export default router;
