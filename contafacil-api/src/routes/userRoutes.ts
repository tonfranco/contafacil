import { Router } from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  updateUserPreferences
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);
router.put('/me/preferences', updateUserPreferences);

export default router;
