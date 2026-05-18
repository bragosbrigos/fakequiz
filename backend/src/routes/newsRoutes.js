import express from 'express';
import { fetchAllNews, fetchNewsFromRSS } from '../services/newsService.js';

const router = express.Router();

// GET /api/news - Retorna todas as notícias
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let news;
    if (category) {
      // Para categoria específica, buscamos diretamente do feed
      const RSS_FEEDS = {
        all: 'https://www.invenglobal.com/lol/rss',
        cblol: 'https://www.invenglobal.com/lol/cblol/rss',
        international: 'https://www.invenglobal.com/lol/international/rss',
        worlds: 'https://www.invenglobal.com/lol/worlds/rss'
      };
      
      if (RSS_FEEDS[category]) {
        news = await fetchNewsFromRSS(RSS_FEEDS[category], category);
      } else {
        news = await fetchAllNews(category);
      }
    } else {
      news = await fetchAllNews();
    }
    
    res.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro na rota de notícias:', error);
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
      { id: 'patches', name: 'Patches', description: 'Atualizações e patches do jogo' },
    ],
  });
});

export default router;
