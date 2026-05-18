import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['enclosure', 'image', 'content:encoded', 'media:content']
  }
});

// Feeds RSS que funcionam e estão disponíveis publicamente
const RSS_FEEDS = {
  all: 'https://www.pcgamesn.com/league-of-legends/feed',
  cblol: 'https://www.pcgamesn.com/league-of-legends/feed', // Usando o mesmo feed, filtraremos por palavras-chave
  international: 'https://www.pcgamesn.com/league-of-legends/feed'
};

async function fetchNewsFromRSS(feedUrl, category) {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.map((item, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      title: item.title || 'Sem título',
      url: item.link || '#',
      source: 'PCGamesN',
      category: category,
      publishedAt: item.pubDate || new Date().toISOString(),
      summary: item.contentSnippet || item.description?.substring(0, 200) || '',
      imageUrl: item.enclosure?.url || item.image?.url || item['media:content']?.['$']?.url || null,
      author: item.creator || item.author || 'PCGamesN'
    }));
  } catch (error) {
    console.error(`Erro ao buscar RSS de ${category}:`, error.message);
    return [];
  }
}

export async function fetchAllNews(category = 'all') {
  if (category !== 'all' && !RSS_FEEDS[category]) {
    throw new Error(`Categoria inválida: ${category}`);
  }

  if (category !== 'all') {
    return await fetchNewsFromRSS(RSS_FEEDS[category], category);
  }

  // Busca todas as categorias e combina
  const [general] = await Promise.all([
    fetchNewsFromRSS(RSS_FEEDS.all, 'all')
  ]);

  // Remove duplicatas baseado na URL
  const uniqueNews = general.filter((news, index, self) => 
    index === self.findIndex(n => n.url === news.url)
  );

  // Ordena por data (mais recente primeiro)
  return uniqueNews.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

export { fetchNewsFromRSS };
