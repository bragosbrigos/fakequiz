import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/newsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/news', newsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LoL Stats API - Backend de Notícias',
    version: '1.0.0',
    endpoints: {
      news: '/api/news',
      newsByCategory: '/api/news?category=cblol',
      categories: '/api/news/categories',
      health: '/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📰 Endpoint de notícias: http://localhost:${PORT}/api/news`);
  console.log(`🏆 Endpoint CBLOL: http://localhost:${PORT}/api/news?category=cblol`);
});

export default app;
