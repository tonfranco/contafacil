import { Router } from 'express';
import { 
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory
} from '../controllers/budgetController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para orçamentos
router.get('/', getAllBudgets);
router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

// Rotas para categorias de orçamento
router.get('/:budgetId/categories', getBudgetCategories);
router.post('/:budgetId/categories', createBudgetCategory);
router.put('/:budgetId/categories/:categoryId', updateBudgetCategory);
router.delete('/:budgetId/categories/:categoryId', deleteBudgetCategory);

export default router;
