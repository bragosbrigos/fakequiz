/* eslint-disable no-unused-vars */
import React from 'react';

export const TEAMS = {
  CBLOL: [
    { id: 1, name: 'LOUD', logo: '🔊', region: 'BR' },
    { id: 2, name: 'paiN Gaming', logo: '🎯', region: 'BR' },
    { id: 3, name: 'FURIA', logo: '🐾', region: 'BR' },
    { id: 4, name: 'INTZ', logo: '🔴', region: 'BR' },
    { id: 5, name: 'Fluxo', logo: '⚡', region: 'BR' },
    { id: 6, name: 'RED Canids', logo: '🔺', region: 'BR' },
    { id: 7, name: 'KaBuM!', logo: '💥', region: 'BR' },
    { id: 8, name: 'LOS', logo: '🦁', region: 'BR' },
  ],
  LCK: [
    { id: 10, name: 'T1', logo: '🏆', region: 'KR' },
    { id: 11, name: 'Gen.G', logo: '🟡', region: 'KR' },
    { id: 12, name: 'DRX', logo: '🐉', region: 'KR' },
    { id: 13, name: 'Hanwha Life Esports', logo: '🦅', region: 'KR' },
    { id: 14, name: 'Dplus KIA', logo: '🚗', region: 'KR' },
  ],
  LEC: [
    { id: 20, name: 'G2 Esports', logo: '🎮', region: 'EU' },
    { id: 21, name: 'Fnatic', logo: '🟠', region: 'EU' },
    { id: 22, name: 'MAD Lions', logo: '🦁', region: 'EU' },
    { id: 23, name: 'Team BDS', logo: '🔵', region: 'EU' },
  ],
  LCS: [
    { id: 30, name: 'Cloud9', logo: '☁️', region: 'NA' },
    { id: 31, name: 'Team Liquid', logo: '🌊', region: 'NA' },
    { id: 32, name: '100 Thieves', logo: '💯', region: 'NA' },
  ],
  LPL: [
    { id: 40, name: 'JD Gaming', logo: '🔴', region: 'CN' },
    { id: 41, name: 'Bilibili Gaming', logo: '📺', region: 'CN' },
    { id: 42, name: 'EDward Gaming', logo: '👑', region: 'CN' },
    { id: 43, name: 'Top Esports', logo: '🔝', region: 'CN' },
  ]
};

export const CHAMPIONS = ['Azir', 'Orianna', 'Ahri', 'Zoe', 'Syndra', 'LeBlanc', 'Viktor', 'Akali', 'Sylas', 'Corki', 'Jayce', 'Gnar', 'Jax', 'Aatrox', 'Gwen', 'Renekton', 'Graves', 'Nidalee', 'Lee Sin', 'Kindred', 'Viego', 'Xin Zhao', 'Wukong', 'Sejuani', 'Jinx', 'Aphelios', 'Kai\'Sa', 'Zeri', 'Varus', 'Ezreal', 'Thresh', 'Nautilus', 'Rakan', 'Alistar', 'Leona', 'Braum', 'Renata', 'Lulu', 'Yuumi'];
export const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

export function generatePlayer(league, index) {
  const teams = TEAMS[league];
  const team = teams[index % teams.length];
  const role = ROLES[index % 5];
  const names = {
    CBLOL: ['Robo', 'Carioca', 'Grevthar', 'TitaN', 'Envy', 'Brance', 'Kuri', 'Tandercito', 'Ayala', 'Aegis', 'MicaO', 'Wizer', 'Goot', 'RedBert', 'RATO'],
    LCK: ['Faker', 'Chovy', 'Keria', 'Ruler', 'ShowMaker', 'Canyon', 'Doran', 'Peanut', 'Zeus', 'Oner', 'Gumayusi', 'Lehends', 'Pyosik', 'Deft', 'Bdd'],
    LEC: ['Caps', 'Yike', 'Hans Sama', 'Mikyx', 'BrokenBlade', 'Humanoid', 'Upset', 'Elyoya', 'Razork', 'Nisqy', 'Comp', 'Kaiser', 'Alvaro', 'Fresskowy', 'Vetheo'],
    LCS: ['Jensen', 'Berserker', 'Blaber', 'Fudge', 'CoreJJ', 'Spica', 'Impact', 'Tactical', 'Zven', 'Ssumday', 'Palafox', 'Armao', 'Busio', 'Ignar', 'huhi'],
    LPL: ['Knight', 'Elk', 'Kanavi', 'Rookie', 'Meiko', 'JackeyLove', 'Bin', 'Xun', 'Scout', 'Uzi', 'Wei', '369', 'Crisp', 'Tian', 'Ming']
  };
  const name = names[league][index % names[league].length];
  return {
    id: `${league}-${index}`,
    name,
    team: team.name,
    teamLogo: team.logo,
    league,
    role,
    region: team.region,
    kda: parseFloat(randF(2.5, 8.5)),
    kills: rand(2, 12),
    deaths: rand(0, 5),
    assists: rand(4, 16),
    csPerMin: parseFloat(randF(6.5, 11.2)),
    kp: rand(45, 85),
    wr: rand(45, 78),
    games: rand(15, 45),
    damage: rand(12000, 35000),
    gold: rand(8000, 18000),
    vision: parseFloat(randF(0.8, 3.2)),
    mostPlayedChamps: Array.from({ length: 5 }, (_, i) => ({
      champion: CHAMPIONS[rand(0, CHAMPIONS.length - 1)],
      games: rand(5, 25),
      wins: rand(3, 20),
    })),
  };
}

export function generateMatch(player) {
  const champ = CHAMPIONS[rand(0, CHAMPIONS.length - 1)];
  const win = Math.random() > 0.4;
  const k = rand(1, 14), d = rand(0, 8), a = rand(2, 20);
  const minutesAgo = rand(1, 720);
  return {
    id: `match-${Math.random().toString(36).substr(2, 8)}`,
    player: player.name,
    playerId: player.id,
    champion: champ,
    kills: k, deaths: d, assists: a,
    win,
    cs: rand(120, 380),
    damage: rand(8000, 45000),
    gold: rand(8000, 22000),
    timeAgo: minutesAgo,
    duration: rand(22, 48),
    league: player.league,
  };
}

// Scheduled matches for calendar
export const SCHEDULED_MATCHES = [
  // CBLOL
  { id: 'sch-1', league: 'CBLOL', team1: 'LOUD', team2: 'paiN Gaming', team1Logo: '🔊', team2Logo: '🎯', date: '2026-01-15', time: '18:00', stage: 'Semifinal', bestOf: 5 },
  { id: 'sch-2', league: 'CBLOL', team1: 'FURIA', team2: 'Fluxo', team1Logo: '🐾', team2Logo: '⚡', date: '2026-01-16', time: '19:00', stage: 'Semifinal', bestOf: 5 },
  { id: 'sch-3', league: 'CBLOL', team1: 'RED Canids', team2: 'INTZ', team1Logo: '🔺', team2Logo: '🔴', date: '2026-01-18', time: '17:00', stage: 'Final', bestOf: 5 },
  // LCK
  { id: 'sch-4', league: 'LCK', team1: 'T1', team2: 'Gen.G', team1Logo: '🏆', team2Logo: '🟡', date: '2026-01-14', time: '11:00', stage: 'Regular Season', bestOf: 3 },
  { id: 'sch-5', league: 'LCK', team1: 'DRX', team2: 'Hanwha Life Esports', team1Logo: '🐉', team2Logo: '🦅', date: '2026-01-15', time: '11:00', stage: 'Regular Season', bestOf: 3 },
  { id: 'sch-6', league: 'LCK', team1: 'Dplus KIA', team2: 'T1', team1Logo: '🚗', team2Logo: '🏆', date: '2026-01-17', time: '10:00', stage: 'Regular Season', bestOf: 3 },
  // LEC
  { id: 'sch-7', league: 'LEC', team1: 'G2 Esports', team2: 'Fnatic', team1Logo: '🎮', team2Logo: '🟠', date: '2026-01-16', time: '15:00', stage: 'Regular Season', bestOf: 1 },
  { id: 'sch-8', league: 'LEC', team1: 'MAD Lions', team2: 'Team BDS', team1Logo: '🦁', team2Logo: '🔵', date: '2026-01-17', time: '16:00', stage: 'Regular Season', bestOf: 1 },
  // LCS
  { id: 'sch-9', league: 'LCS', team1: 'Cloud9', team2: 'Team Liquid', team1Logo: '☁️', team2Logo: '🌊', date: '2026-01-18', time: '20:00', stage: 'Regular Season', bestOf: 1 },
  { id: 'sch-10', league: 'LCS', team1: '100 Thieves', team2: 'Cloud9', team1Logo: '💯', team2Logo: '☁️', date: '2026-01-19', time: '21:00', stage: 'Regular Season', bestOf: 1 },
  // LPL
  { id: 'sch-11', league: 'LPL', team1: 'JD Gaming', team2: 'Bilibili Gaming', team1Logo: '🔴', team2Logo: '📺', date: '2026-01-14', time: '08:00', stage: 'Regular Season', bestOf: 3 },
  { id: 'sch-12', league: 'LPL', team1: 'EDward Gaming', team2: 'Top Esports', team1Logo: '👑', team2Logo: '🔝', date: '2026-01-15', time: '09:00', stage: 'Regular Season', bestOf: 3 },
];

export const NEWS = [
  { 
    id: 1,
    title: 'T1 domina LCK com campanha perfeita na etapa regular', 
    source: 'Liquipedia', 
    date: 'há 2h', 
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=340&fit=crop', 
    summary: 'A equipe de Faker continua imbatível na LCK 2026, com 18 vitórias consecutivas e um KDA coletivo impressionante.',
    fullContent: '<p>A T1 está simplesmente dominando a LCK 2026. Com uma campanha perfeita de 18 vitórias e 0 derrotas, a equipe comandada por Faker mostra um nível técnico absurdo.</p><p>O mid laner, considerado o maior jogador de todos os tempos, está com um KDA de 12.5 na competição, demonstrando que mesmo após anos de carreira continua no topo.</p><p>A equipe também conta com excelentes atuações de Zeus no topo e Gumayusi no ADC, formando uma das formações mais equilibradas dos últimos anos.</p><p>Especialistas apontam que a T1 é a grande favorita para conquistar o título do Worlds 2026, caso mantenha esse ritmo.</p>'
  },
  { 
    id: 2,
    title: 'CBLOL 2026: LOUD anuncia nova formação estelar', 
    source: 'CBLOL.gg', 
    date: 'há 5h', 
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=340&fit=crop', 
    summary: 'A LOUD revelou sua nova roster para a split de verão, com mudanças que prometem agitar o cenário brasileiro.',
    fullContent: '<p>A LOUD oficializou hoje sua nova formação para o CBLOL 2026 Split de Verão. A equipe trouxe reforços de peso visando o título inédito.</p><p>Dentre as principais mudanças estão a contratação do jungler coreano "Shadow" e do ADC brasileiro Robo, que retorna ao time titular após boa passagem pela academy.</p><p>O técnico da equipe declarou em entrevista: "Estamos montando um time para ganhar o CBLOL e representar bem o Brasil no internacional".</p><p>A torcida da LOUD está otimista e acredita que finalmente o time pode quebrar o jejum de títulos no campeonato nacional.</p>'
  },
  { 
    id: 3,
    title: 'Patch 14.10 traz mudanças drásticas no meta de ADC', 
    source: 'Riot Games', 
    date: 'há 8h', 
    img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=340&fit=crop', 
    summary: 'A Riot anunciou alterações significativas em itens e campeões de atirador, o que deve impactar diretamente o cenário competitivo.',
    fullContent: '<p>A Riot Games divulgou as mudanças do patch 14.10, que promete revolucionar o papel dos atiradores (ADCs) no jogo.</p><p>Entre as principais alterações estão nerfs no item "Gume do Infinito" e buffs em itens de utilidade como "Sentinela de Pedra". Campeões como Jinx e Aphelios foram nerfados, enquanto Ezreal e Varus receberam buffs significativos.</p><p>Profissionais do cenário mundial já se manifestaram sobre as mudanças. O ADC da Cloud9 declarou: "Isso vai tornar o role mais dependente de suporte e menos focado em carregar sozinho".</p><p>O patch entra em vigor na próxima semana e deve causar grande impacto nas estratégias competitivas.</p>'
  },
  { 
    id: 4,
    title: 'G2 Esports vence LEC Spring Split com performance histórica', 
    source: 'LEC.gg', 
    date: 'há 12h', 
    img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=340&fit=crop', 
    summary: 'Caps e companhia dominaram a final contra Fnatic com uma série 3-0 convincente, garantindo vaga no MSI.',
    fullContent: '<p>A G2 Esports conquistou o título do LEC Spring Split 2026 de forma dominante. Na grande final contra a Fnatic, a equipe venceu por 3-0 sem dar chances aos adversários.</p><p>Caps, astro do meio da G2, foi eleito MVP da final com atuações espetaculares em Azir e LeBlanc. O jogador somou um KDA de 15.2 na série.</p><p>Com o título, a G2 garante vaga automática no Mid-Season Invitational (MSI), onde enfrentará as melhores equipes das outras regiões.</p><p>"Esse é só o começo. Queremos trazer o troféu do Worlds para a Europa esse ano", declarou Yike, jungler da equipe.</p>'
  },
  { 
    id: 5,
    title: 'Cloud9 surpreende LCS com estratégia inovadora de draft', 
    source: 'LCS.gg', 
    date: 'há 1 dia', 
    img: 'https://images.unsplash.com/photo-1542751110-974271209649?w=600&h=340&fit=crop', 
    summary: 'A C9 vem utilizando composições atípicas que estão confundindo os analistas e derrotando os favoritos.',
    fullContent: '<p>A Cloud9 está revolucionando a LCS com uma abordagem única de drafts. A equipe tem priorizado composições focadas em controle de mapa e rotacionações rápidas.</p><p>O treinador da C9 explicou em entrevista: "Não estamos seguindo o meta cegamente. Analisamos cada partida e adaptamos nossa estratégia".</p><p>Jogadores como Fudge no topo e Jensen no meio têm se destacado executando essas composições não convencionais.</p><p>Analistas estão divididos: alguns acreditam que a estratégia funciona apenas contra times menores, enquanto outros veem potencial para mudar o meta global.</p>'
  },
  { 
    id: 6,
    title: 'JDG confirma presença no Worlds 2026 com campanha dominante', 
    source: 'LPL.cn', 
    date: 'há 1 dia', 
    img: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=340&fit=crop', 
    summary: 'A equipe chinesa JD Gaming garantiu sua vaga no mundial com uma das melhores campanhas da história da LPL.',
    fullContent: '<p>A JD Gaming assegurou sua classificação para o Worlds 2026 com uma campanha histórica na LPL. A equipe soma 22 vitórias e apenas 2 derrotas.</p><p>Kanavi, o jungler estrela da equipe, está liderando várias estatísticas da liga, incluindo KDA (8.9), participação em kills (78%) e controle de objetivos.</p><p>"Nosso objetivo é vencer o Worlds. Não viemos apenas para participar", afirmou Knight, mid laner da equipe, em entrevista coletiva.</p><p>A JDG é considerada uma das favoritas ao título mundial, ao lado da T1 e possivelmente da G2, dependendo do desempenho no MSI.</p>'
  },
];

// Generate data
export const PLAYERS = {};
Object.keys(TEAMS).forEach(league => {
  PLAYERS[league] = Array.from({ length: 15 }, (_, i) => generatePlayer(league, i));
  PLAYERS[league].sort((a, b) => b.kda - a.kda);
});

export const MATCHES = {};
Object.keys(PLAYERS).forEach(league => {
  MATCHES[league] = PLAYERS[league].slice(0, 5).flatMap(p =>
    Array.from({ length: 5 }, () => generateMatch(p))
  );
  MATCHES[league].sort((a, b) => b.timeAgo - a.timeAgo);
});

export const getAllPlayers = () => Object.values(PLAYERS).flat();
export const getAllMatches = () => Object.values(MATCHES).flat();
export const getTopPlayers = (count = 8) => getAllPlayers().sort((a, b) => b.kda - a.kda).slice(0, count);
export const getPlayerById = (playerId, league) => PLAYERS[league]?.find(p => p.id === playerId);
export const getScheduledMatches = () => SCHEDULED_MATCHES.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
