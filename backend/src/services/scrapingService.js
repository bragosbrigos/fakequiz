const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const axios = require('axios');

// URLs corrigidas (sem espaços no final)
const LEAGUES = [
  { name: 'LCS', url: 'https://oracleselixir.com/stats/players/byTournament/LCS%2F2026%20Season%2FSpring%20Season' },
  { name: 'LCK', url: 'https://oracleselixir.com/stats/players/byTournament/LCK%2F2026%20Season%2FRounds%201-2' },
  { name: 'LEC', url: 'https://oracleselixir.com/stats/players/byTournament/LEC%2F2026%20Season%2FSpring%20Season' },
  { name: 'LPL', url: 'https://oracleselixir.com/stats/players/byTournament/LPL%2F2026%20Season%2FSplit%202' },
  { name: 'CBLOL', urls: [
    'https://oracleselixir.com/stats/players/byTournament/CBLOL%2F2026%20Season%2FSplit%201',
    'https://oracleselixir.com/stats/players/byTournament/CBLOL%2F2026%20Season%2FSplit%201%20Playoffs'
  ]}
];

const TEAMS_LEAGUES = [
  { name: 'LCS', url: 'https://oracleselixir.com/stats/teams/byTournament/LCS%2F2026%20Season%2FSpring%20Season' },
  { name: 'LCK', url: 'https://oracleselixir.com/stats/teams/byTournament/LCK%2F2026%20Season%2FRounds%201-2' },
  { name: 'LEC', url: 'https://oracleselixir.com/stats/teams/byTournament/LEC%2F2026%20Season%2FSpring%20Season' },
  { name: 'LPL', url: 'https://oracleselixir.com/stats/teams/byTournament/LPL%2F2026%20Season%2FSplit%202' },
  { name: 'CBLOL', urls: [
    'https://oracleselixir.com/stats/teams/byTournament/CBLOL%2F2026%20Season%2FSplit%201',
    'https://oracleselixir.com/stats/teams/byTournament/CBLOL%2F2026%20Season%2FSplit%201%20Playoffs'
  ]}
];

const CHAMPIONS_LEAGUES = [
  { name: 'LCS', url: 'https://oracleselixir.com/stats/champions/byTournament/LCS%2F2026%20Season%2FSpring%20Season' },
  { name: 'LCK', url: 'https://oracleselixir.com/stats/champions/byTournament/LCK%2F2026%20Season%2FRounds%201-2' },
  { name: 'LEC', url: 'https://oracleselixir.com/stats/champions/byTournament/LEC%2F2026%20Season%2FSpring%20Season' },
  { name: 'LPL', url: 'https://oracleselixir.com/stats/champions/byTournament/LPL%2F2026%20Season%2FSplit%202' },
  { name: 'CBLOL', urls: [
    'https://oracleselixir.com/stats/champions/byTournament/CBLOL%2F2026%20Season%2FSplit%201',
    'https://oracleselixir.com/stats/champions/byTournament/CBLOL%2F2026%20Season%2FSplit%201%20Playoffs'
  ]}
];

const DOWNLOAD_DIR = path.join(__dirname, '../../downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Headers para simular um navegador real e evitar bloqueios básicos
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.google.com/',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadCSV(page, url, filename) {
  try {
    console.log(`🌐 Acessando: ${url}`);
    
    // Navegar para a página com headers personalizados
    await page.setExtraHTTPHeaders(HEADERS);
    
    // Random delay antes de carregar para parecer humano
    await sleep(Math.floor(Math.random() * 2000) + 1000);

    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    // Verificar se houve redirecionamento para Cloudflare ou erro
    const title = await page.title();
    if (title.includes('Cloudflare') || title.includes('Just a moment')) {
      throw new Error('Bloqueio do Cloudflare detectado. O site impediu o acesso automatizado.');
    }

    // Configurar download
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR,
    });

    console.log(`🔍 Procurando botão de download...`);

    // Estratégias múltiplas para encontrar o botão
    let downloadClicked = false;
    
    // Estratégia 1: Texto exato
    try {
      await page.waitForFunction(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.find(link => link.textContent.trim() === 'Download This Table');
      }, { timeout: 10000 });

      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const target = links.find(link => link.textContent.trim() === 'Download This Table');
        if (target) target.click();
      });
      downloadClicked = true;
    } catch (e) {
      console.log('Texto exato não encontrado, tentando variações...');
    }

    // Estratégia 2: Texto parcial ou atributo download
    if (!downloadClicked) {
      try {
        await page.waitForFunction(() => {
          const links = Array.from(document.querySelectorAll('a'));
          return links.find(link => 
            link.textContent.toLowerCase().includes('download') || 
            link.getAttribute('download') !== null
          );
        }, { timeout: 5000 });

        await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          const target = links.find(link => 
            link.textContent.toLowerCase().includes('download') || 
            link.getAttribute('download') !== null
          );
          if (target) target.click();
        });
        downloadClicked = true;
      } catch (e) {
        console.log('Nenhum botão de download encontrado.');
      }
    }

    if (!downloadClicked) {
      const allLinks = await page.$$eval('a', links => links.map(l => l.textContent.trim()));
      console.error('❌ Botão de download não encontrado. Links disponíveis:', allLinks.slice(0, 10));
      throw new Error('Botão de download não encontrado na página.');
    }

    console.log(`✅ Clique acionado. Aguardando download...`);
    
    // Aguardar o arquivo aparecer
    let attempts = 0;
    let filePath = null;
    
    while (attempts < 10 && !filePath) {
      await sleep(2000);
      const files = fs.readdirSync(DOWNLOAD_DIR)
        .filter(f => f.endsWith('.csv') && f.includes(filename.split('.')[0])) // Busca arquivos relacionados
        .map(f => ({ name: f, time: fs.statSync(path.join(DOWNLOAD_DIR, f)).mtime }));

      if (files.length > 0) {
        files.sort((a, b) => b.time - a.time);
        filePath = path.join(DOWNLOAD_DIR, files[0].name);
        
        // Renomear para o padrão esperado
        const finalPath = path.join(DOWNLOAD_DIR, filename);
        if (files[0].name !== filename) {
           try {
             fs.renameSync(filePath, finalPath);
             filePath = finalPath;
           } catch (renameErr) {
             // Se falhar ao renomear, usa o nome original
             console.warn('⚠️ Falha ao renomear arquivo, usando nome original.');
           }
        }
      }
      attempts++;
    }

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error('Arquivo CSV não foi baixado após várias tentativas.');
    }

    // Verificar se o arquivo tem conteúdo
    const stats = fs.statSync(filePath);
    if (stats.size < 100) { // Arquivos CSV válidos geralmente têm mais que 100 bytes
      throw new Error(`Arquivo baixado é muito pequeno (${stats.size} bytes), possivelmente inválido.`);
    }

    return filePath;

  } catch (error) {
    console.error(`❌ Erro no download de ${url}:`, error.message);
    throw error;
  }
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function scrapePlayers() {
  console.log('🤖 Iniciando scrape de jogadores...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(HEADERS['User-Agent']);

    const allPlayers = [];

    for (const league of LEAGUES) {
      console.log(`\n🏆 Processando liga: ${league.name}`);

      const urlsToProcess = league.urls || [league.url];

      if (urlsToProcess.length > 1) {
        let leaguePlayers = [];
        const playerStatsMap = new Map();
        
        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          const filename = `players_${league.name.toLowerCase()}_${i}.csv`;
          console.log(`  📄 Baixando parte ${i + 1}/${urlsToProcess.length}...`);

          try {
            const filePath = await downloadCSV(page, url, filename);
            if (filePath && fs.existsSync(filePath)) {
              const players = await parseCSV(filePath);
              players.forEach(p => p.league = league.name);
              
              // Agrupar por jogador e SOMAR estatísticas
              for (const player of players) {
                const playerName = player.Player || player.player || player.Name || 'Unknown';
                if (playerStatsMap.has(playerName)) {
                  const existingPlayer = playerStatsMap.get(playerName);
                  const keys = Object.keys(player);
                  const gamesKey = keys.find(k => k.toLowerCase().includes('games') || k.toLowerCase() === 'gp');
                  const winsKey = keys.find(k => k.toLowerCase().includes('win') && !k.toLowerCase().includes('percentage'));
                  
                  if(gamesKey) existingPlayer[gamesKey] = String((parseInt(existingPlayer[gamesKey]) || 0) + (parseInt(player[gamesKey]) || 0));
                  if(winsKey) existingPlayer[winsKey] = String((parseInt(existingPlayer[winsKey]) || 0) + (parseInt(player[winsKey]) || 0));
                } else {
                  playerStatsMap.set(playerName, { ...player });
                }
              }
              console.log(`    ✅ ${players.length} registros processados`);
            }
          } catch (err) {
            console.warn(`⚠️ Falha ao baixar parte ${i + 1}: ${err.message}`);
          }
        }

        const uniquePlayers = Array.from(playerStatsMap.values());
        console.log(`  💾 Total único para ${league.name}: ${uniquePlayers.length} jogadores`);
        allPlayers.push(...uniquePlayers);
      } else {
        const url = urlsToProcess[0];
        const filename = `players_${league.name.toLowerCase()}.csv`;
        console.log(`  📄 Baixando URL única...`);

        try {
          const filePath = await downloadCSV(page, url, filename);
          if (filePath && fs.existsSync(filePath)) {
            const players = await parseCSV(filePath);
            players.forEach(p => p.league = league.name);
            allPlayers.push(...players);
            console.log(`    ✅ ${players.length} jogadores extraídos`);
          }
        } catch (err) {
          console.warn(`⚠️ Falha ao baixar liga ${league.name}: ${err.message}`);
        }
      }
    }

    console.log(`\n🎉 Total de jogadores extraídos: ${allPlayers.length}`);
    return allPlayers;
  } catch (error) {
    console.error('💥 Erro crítico no scrape de jogadores:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function scrapeTeams() {
  console.log('🤖 Iniciando scrape de times...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(HEADERS['User-Agent']);

    const allTeams = [];

    for (const league of TEAMS_LEAGUES) {
      console.log(`\n🏆 Processando liga: ${league.name}`);
      const urlsToProcess = league.urls || [league.url];

      if (urlsToProcess.length > 1) {
        let leagueTeams = [];
        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          const filename = `teams_${league.name.toLowerCase()}_${i}.csv`;
          console.log(`  📄 Baixando parte ${i + 1}...`);

          try {
            const filePath = await downloadCSV(page, url, filename);
            if (filePath && fs.existsSync(filePath)) {
              const teams = await parseCSV(filePath);
              teams.forEach(t => t.league = league.name);
              leagueTeams = leagueTeams.concat(teams);
            }
          } catch (err) {
            console.warn(`⚠️ Falha na parte ${i + 1}: ${err.message}`);
          }
        }

        // Consolidar dados de times
        const teamMap = new Map();
        for (const team of leagueTeams) {
          const teamName = team.Team || team.team || team.Name;
          if (teamName) {
            if (teamMap.has(teamName)) {
              const existingTeam = teamMap.get(teamName);
              // Somar estatísticas numéricas simples se existirem
              ['games_played', 'wins', 'losses'].forEach(key => {
                if (team[key] && existingTeam[key]) {
                  existingTeam[key] = String((parseInt(existingTeam[key]) || 0) + (parseInt(team[key]) || 0));
                }
              });
            } else {
              teamMap.set(teamName, { ...team });
            }
          }
        }
        allTeams.push(...Array.from(teamMap.values()));
        console.log(`  💾 Total consolidado: ${teamMap.size} times`);
      } else {
        const url = urlsToProcess[0];
        const filename = `teams_${league.name.toLowerCase()}.csv`;
        try {
          const filePath = await downloadCSV(page, url, filename);
          if (filePath && fs.existsSync(filePath)) {
            const teams = await parseCSV(filePath);
            teams.forEach(t => t.league = league.name);
            allTeams.push(...teams);
            console.log(`    ✅ ${teams.length} times extraídos`);
          }
        } catch (err) {
          console.warn(`⚠️ Falha ao baixar: ${err.message}`);
        }
      }
    }

    console.log(`\n🎉 Total de times extraídos: ${allTeams.length}`);
    return allTeams;
  } catch (error) {
    console.error('💥 Erro no scrape de times:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function scrapeChampions() {
  console.log('🤖 Iniciando scrape de campeões...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(HEADERS['User-Agent']);

    const allChampions = [];

    for (const league of CHAMPIONS_LEAGUES) {
      console.log(`\n🏆 Processando liga: ${league.name}`);
      const urlsToProcess = league.urls || [league.url];

      if (urlsToProcess.length > 1) {
        let leagueChampions = [];
        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          const filename = `champions_${league.name.toLowerCase()}_${i}.csv`;
          
          try {
            const filePath = await downloadCSV(page, url, filename);
            if (filePath && fs.existsSync(filePath)) {
              const champions = await parseCSV(filePath);
              champions.forEach(c => c.league = league.name);
              leagueChampions = leagueChampions.concat(champions);
            }
          } catch (err) {
            console.warn(`⚠️ Falha na parte ${i + 1}: ${err.message}`);
          }
        }

        // Consolidar campeões
        const champMap = new Map();
        for (const champ of leagueChampions) {
          const keys = Object.keys(champ);
          const findKey = (patterns) => keys.find(k => patterns.some(p => k.toLowerCase() === p.toLowerCase()));
          
          const champName = champ[findKey(['champion', 'champ', 'name'])] || 'Unknown';
          const role = (champ[findKey(['role', 'lane', 'position'])] || 'UNKNOWN').toUpperCase();
          const key = `${champName}-${role}`;
          
          if (champMap.has(key)) {
            const existingChamp = champMap.get(key);
            const gamesKey = findKey(['games', 'gp']);
            const winsKey = findKey(['wins', 'w']);
            
            if(gamesKey) existingChamp[gamesKey] = String((parseInt(existingChamp[gamesKey]) || 0) + (parseInt(champ[gamesKey]) || 0));
            if(winsKey) existingChamp[winsKey] = String((parseInt(existingChamp[winsKey]) || 0) + (parseInt(champ[winsKey]) || 0));
          } else {
            champMap.set(key, { ...champ });
          }
        }
        allChampions.push(...Array.from(champMap.values()));
        console.log(`  💾 Total consolidado: ${champMap.size} campeões`);
      } else {
        const url = urlsToProcess[0];
        const filename = `champions_${league.name.toLowerCase()}.csv`;
        try {
          const filePath = await downloadCSV(page, url, filename);
          if (filePath && fs.existsSync(filePath)) {
            const champions = await parseCSV(filePath);
            champions.forEach(c => c.league = league.name);
            allChampions.push(...champions);
            console.log(`    ✅ ${champions.length} campeões extraídos`);
          }
        } catch (err) {
          console.warn(`⚠️ Falha ao baixar: ${err.message}`);
        }
      }
    }

    console.log(`\n🎉 Total de campeões extraídos: ${allChampions.length}`);
    
    // Buscar imagens
    console.log('🖼️ Buscando imagens dos campeões...');
    const championImages = await fetchChampionImages();
    
    const championsWithImages = allChampions.map(champ => {
      const keys = Object.keys(champ);
      const findKey = (patterns) => keys.find(k => patterns.some(p => k.toLowerCase() === p.toLowerCase()));
      const iconKey = findKey(['icon', 'image', 'url']);
      const champName = champ[findKey(['champion', 'champ', 'name'])] || '';
      
      if (champ[iconKey] && champ[iconKey].trim() !== '') return champ;
      
      const formattedName = formatChampionName(champName);
      const imageUrl = championImages[formattedName] || null;
      
      if (imageUrl) {
        return { ...champ, [iconKey || 'icon_url']: imageUrl };
      }
      return champ;
    });
    
    return championsWithImages;
  } catch (error) {
    console.error('💥 Erro no scrape de campeões:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function fetchChampionImages() {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/16.1.1/data/en_US/champion.json', {
      headers: { 'User-Agent': HEADERS['User-Agent'] }
    });
    const championData = response.data.data;
    
    const imageMap = {};
    for (const [key, champion] of Object.entries(championData)) {
      const url = `https://ddragon.leagueoflegends.com/cdn/16.1.1/img/champion/${key}.png`;
      imageMap[key.toUpperCase()] = url;
      
      const formattedName = formatChampionName(champion.name);
      if (formattedName !== key.toUpperCase()) {
        imageMap[formattedName] = url;
      }
    }
    return imageMap;
  } catch (error) {
    console.error('❌ Erro ao buscar imagens:', error.message);
    return {};
  }
}

function formatChampionName(name) {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

module.exports = { scrapePlayers, scrapeTeams, scrapeChampions };
