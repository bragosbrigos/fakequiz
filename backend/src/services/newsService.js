import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['dc:creator', 'author'],
    ],
  },
});

// Feed RSS funcional para League of Legends
const RSS_FEEDS = {
  all: 'https://www.pcgamesn.com/league-of-legends/feed',
  cblol: 'https://www.pcgamesn.com/league-of-legends/feed',
  international: 'https://www.pcgamesn.com/league-of-legends/feed'
};

export async function fetchNewsFromRSS(feedUrl, category) {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    if (!feed || !feed.items || feed.items.length === 0) {
      throw new Error('Feed vazio ou inválido');
    }
    
    return feed.items.map((item, index) => {
      // Extrair imagem do RSS
      let imageUrl = null;
      
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      } else if (item.mediaContent?.[0]?.$?.url) {
        imageUrl = item.mediaContent[0].$.url;
      } else if (item.mediaThumbnail?.[0]?.$?.url) {
        imageUrl = item.mediaThumbnail[0].$.url;
      } else if (item.image?.url) {
        imageUrl = item.image.url;
      }
      
      if (!imageUrl) {
        imageUrl = 'https://images.contentstack.io/v3/assets/blt5a5281f9e974de16/blt341f1c6c6b96d8f4/61e4c7f6e0a2f70c0c6f8b8a/LoL_2022_Splash_Art.jpg';
      }

      // Formatar data
      const publishedDate = new Date(item.pubDate);
      const now = new Date();
      const diffMs = now - publishedDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo;
      if (diffMins < 1) timeAgo = 'Agora mesmo';
      else if (diffMins < 60) timeAgo = `há ${diffMins} min`;
      else if (diffHours < 24) timeAgo = `há ${diffHours}h`;
      else if (diffDays < 7) timeAgo = `há ${diffDays}d`;
      else timeAgo = publishedDate.toLocaleDateString('pt-BR');

      // Determinar categoria baseada no conteúdo
      const titleLower = item.title.toLowerCase();
      let category = 'Geral';
      let league = null;

      if (titleLower.includes('cblol') || titleLower.includes('brasil') || titleLower.includes('loud') || titleLower.includes('pain') || titleLower.includes('kabum')) {
        category = 'CBLOL';
        league = 'CBLOL';
      } else if (titleLower.includes('patch') || titleLower.includes('update') || titleLower.includes('nerf') || titleLower.includes('buff')) {
        category = 'Patches';
      } else if (titleLower.includes('lck') || titleLower.includes('lec') || titleLower.includes('lcs') || titleLower.includes('lpl') || titleLower.includes('worlds') || titleLower.includes('msi')) {
        category = 'Internacional';
        league = 'INTERNATIONAL';
      }

      return {
        id: `${category}-${index}-${Date.now()}`,
        title: item.title || 'Sem título',
        summary: item.contentSnippet?.substring(0, 150) + '...' || item.description?.substring(0, 150) + '...' || '',
        url: item.link || '#',
        source: 'PCGamesN',
        category,
        league,
        publishedAt: item.pubDate || new Date().toISOString(),
        date: timeAgo,
        img: imageUrl,
        author: item.author || item.creator || 'PCGamesN',
      };
    });
  } catch (error) {
    console.error(`Erro ao buscar RSS:`, error.message);
    return [];
  }
}

export async function fetchAllNews(category = 'all') {
  const feedUrl = RSS_FEEDS[category] || RSS_FEEDS.all;
  return await fetchNewsFromRSS(feedUrl, category);
}
