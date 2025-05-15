import { Router } from 'express';
import { 
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController';

const router = Router();

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;
