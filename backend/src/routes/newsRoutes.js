import express from 'express';
import { fetchAllNews } from '../services/newsService.js';

const router = express.Router();

// GET /api/news - Retorna todas as notícias ou por categoria
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    console.log(`📬 Requisição recebida: /api/news${category ? `?category=${category}` : ''}`);
    
    const news = await fetchAllNews(category || 'all');
    
    console.log(`📤 Respondendo com ${news.length} notícias`);
    
    res.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro na rota de notícias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar notícias',
      message: error.message,
    });
  }
});

// GET /api/news/categories - Retorna categorias disponíveis
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'all', name: 'Todas', description: 'Todas as notícias de LoL' },
      { id: 'cblol', name: 'CBLOL', description: 'Notícias do Campeonato Brasileiro' },
      { id: 'international', name: 'Internacional', description: 'Notícias de ligas internacionais' },
      { id: 'worlds', name: 'Mundial', description: 'Notícias sobre o Campeonato Mundial' },
    ],
  });
});

export default router;
