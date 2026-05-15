 Componentes detalhados
Frontend
Tecnologias: HTML5, CSS3 (ou Tailwind), JS, React.js
Funções:
Tela inicial com rankings (CBLOL, LCS, LEC, LCK, LPL)
Busca por jogador
Cards de estatísticas de partidas
Últimas notícias
Gráficos de KDA, winrate etc (Chart.js ou ApexCharts)
Dados: sempre via backend, nunca direto da Riot
Backend
Tecnologias: Node.js + Express
Rotas principais:
/players/:name → retorna perfil do jogador
/players/:id/matches → últimas partidas do jogador
/leagues/:id/rankings → rankings da liga
/news → últimas notícias
Cron jobs:
Atualizar rankings de cada liga (1x/hora)
Atualizar partidas de jogadores top (a cada 10–30 min)
Atualizar notícias (a cada 30–60 min)
Cache temporário: Redis ou memória, para evitar chamadas repetidas ao banco
Banco de dados (PostgreSQL)
Tabelas principais:

players
| id | puuid | name | team | rank | profileIconId | lastUpdate | ... |

matches
| id | matchId | playerId | champion | kills | deaths | assists | win | date | ... |

teams
| id | name | logoUrl | region | ... |

news
| id | title | url | source | publishedAt | summary | imageUrl |

Relacionamentos
matches.playerId → players.id (FK)
players.team → teams.id (FK)
news é independente, só para exibir no frontend
Integração de APIs
Riot API → dados de jogadores, partidas, ligas
DDragon → imagens de campeões, itens, ícones
RSS / sites de notícias → atualizações de eSports
Opcional: scraping de fotos reais dos jogadores via Liquipedia
Cron jobs / Atualizações
Exemplo de fluxo para partidas:
Buscar top 20 jogadores de cada liga
Para cada jogador, pegar últimas 5–10 partidas
Comparar com PostgreSQL, salvar somente partidas novas
Atualizar cache para frontend
Ranking e notícias seguem cron jobs semelhantes
Cache
Pode usar Redis ou mesmo cache na memória do Node.js
Exemplo:
Rankings: cache 1 hora
Estatísticas de jogador: cache 10–30 min
Notícias: cache 30 min
Isso reduz requisições tanto para o banco quanto para APIs externas
