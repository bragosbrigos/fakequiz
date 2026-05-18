export function NewsGrid({ news, onOpenNews }) {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
        <p className="text-gray-400">Tente selecionar outra categoria ou volte mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <div
          key={item.link || item.id || Math.random()}
          onClick={() => onOpenNews(item)}
          className="group bg-dark-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 cursor-pointer border border-gray-800 hover:border-gold-500/30"
        >
          {/* Imagem */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.imageUrl || item.img || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent" />
            
            {/* Badge da Categoria */}
            <div className="absolute top-4 left-4">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase backdrop-blur-sm ${
                item.category === 'cblol' ? 'bg-green-600/90 text-white' :
                item.category === 'lck' ? 'bg-red-600/90 text-white' :
                item.category === 'lpl' ? 'bg-yellow-600/90 text-white' :
                item.category === 'lec' ? 'bg-blue-600/90 text-white' :
                item.category === 'lcs' ? 'bg-purple-600/90 text-white' :
                item.category === 'worlds' ? 'bg-gold-600/90 text-white' :
                'bg-gray-600/90 text-white'
              }`}>
                {item.category === 'cblol' ? 'CBLOL' :
                 item.category === 'lck' ? 'LCK' :
                 item.category === 'lpl' ? 'LPL' :
                 item.category === 'lec' ? 'LEC' :
                 item.category === 'lcs' ? 'LCS' :
                 item.category === 'worlds' ? 'Mundial' :
                 'Geral'}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
              {item.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {item.description || item.summary || item.contentSnippet || 'Clique para ler a notícia completa'}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-BR') : 'Recente'}
              </span>
              <span className="flex items-center gap-1 text-gold-400">
                Ler mais
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
