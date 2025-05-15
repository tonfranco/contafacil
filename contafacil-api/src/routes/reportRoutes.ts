import { Router } from 'express';
import { 
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  generateIncomeStatementReport,
  generateBalanceSheetReport,
  generateCashFlowReport
} from '../controllers/reportController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas CRUD básicas
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

// Rotas para geração de relatórios específicos
router.post('/generate/income-statement', generateIncomeStatementReport);
router.post('/generate/balance-sheet', generateBalanceSheetReport);
router.post('/generate/cash-flow', generateCashFlowReport);

export default router;
