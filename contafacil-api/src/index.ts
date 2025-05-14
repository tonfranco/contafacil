import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { logger } from './utils/logger';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicia o servidor
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});

export default app;
