import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import concessionariaRoutes from './routes/concessionarias';
import agendamentoRoutes from './routes/agendamentos';
import reviewRoutes from './routes/reviews';
import favoritoRoutes from './routes/favoritos';
import promocaoRoutes from './routes/promocoes';

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições, tente novamente mais tarde' },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/concessionarias', concessionariaRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/promocoes', promocaoRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`MotoLocal API rodando na porta ${PORT}`);
});
