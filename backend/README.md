# Backend de Notícias - LoL Stats API

Backend Node.js para buscar e agregar notícias de League of Legends de múltiplas fontes RSS.

## 🚀 Funcionalidades

- **Agregação de Notícias**: Busca notícias de várias fontes (Google News)
- **Categorias**: Filtra por categoria (CBLOL, Internacional, Mundial)
- **API RESTful**: Endpoints simples e fáceis de consumir
- **Tratamento de Erros**: Fallback automático se uma fonte falhar

## 📦 Instalação

```bash
cd backend
npm install
```

## 🔧 Uso

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor rodará em `http://localhost:3000`

## 🌐 Endpoints da API

### GET `/api/news`
Retorna todas as notícias ou filtra por categoria.

**Parâmetros:**
- `category` (opcional): `all`, `cblol`, `international`, `worlds`

**Exemplos:**
```bash
# Todas as notícias
curl http://localhost:3000/api/news

# Apenas CBLOL
curl http://localhost:3000/api/news?category=cblol

# Internacional
curl http://localhost:3000/api/news?category=international
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cblol-0-1747582844000",
      "title": "FURIA Esports vs LOUD - 17/05/2026 – Estatísticas",
      "url": "https://news.google.com/rss/articles/...",
      "source": "Google News",
      "category": "cblol",
      "publishedAt": "Mon, 18 May 2026 02:40:44 GMT",
      "summary": "Confira as estatísticas completas do jogo...",
      "imageUrl": "https://example.com/image.jpg",
      "author": "Mais Esports"
    }
  ],
  "count": 208,
  "timestamp": "2026-05-18T12:37:24.000Z"
}
```

### GET `/api/news/categories`
Retorna a lista de categorias disponíveis.

**Resposta:**
```json
{
  "success": true,
  "data": [
    { "id": "all", "name": "Todas", "description": "Todas as notícias de LoL" },
    { "id": "cblol", "name": "CBLOL", "description": "Notícias do Campeonato Brasileiro" },
    { "id": "international", "name": "Internacional", "description": "Notícias de ligas internacionais" },
    { "id": "worlds", "name": "Mundial", "description": "Notícias sobre o Campeonato Mundial" }
  ]
}
```

### GET `/health`
Health check da API.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-18T12:37:24.000Z"
}
```

## 🗂️ Estrutura do Projeto

```
backend/
├── src/
│   ├── server.js          # Servidor Express principal
│   └── routes/
│       └── newsRoutes.js  # Rotas da API de notícias
├── services/
│   └── newsService.js     # Serviço de busca de RSS
├── test-news.js           # Script de teste
├── package.json
└── README.md
```

## 🧪 Testes

Execute o script de teste:
```bash
node test-news.js
```

## 📝 Fontes RSS Atuais

- **Google News Brasil**: Notícias gerais de League of Legends
- **Google News CBLOL**: Focado no campeonato brasileiro
- **Google News Internacional**: LCK, LEC, LCS
- **Google News Worlds**: Campeonato Mundial

## ⚙️ Configuração

Para adicionar novas fontes RSS, edite o arquivo `services/newsService.js`:

```javascript
const RSS_FEEDS = {
  all: 'https://news.google.com/rss/search?q=League+of+Legends',
  cblol: 'https://news.google.com/rss/search?q=CBLOL',
  // Adicione suas fontes aqui
};
```

## 🛠️ Tecnologias

- **Node.js** (ES Modules)
- **Express** - Framework web
- **rss-parser** - Parser de feeds RSS
- **cors** - Middleware CORS

## 📄 Licença

MIT
