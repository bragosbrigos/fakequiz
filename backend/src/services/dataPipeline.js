const pool = require('../config/database');
const { scrapePlayers, scrapeTeams, scrapeChampions } = require('./scrapingService');

// Função para salvar estatísticas de campeões no banco de dados
async function saveChampionStatsToDB(champions) {
  console.log(`Salvando ${champions.length} registros de campeões no banco...`);
  
  for (const champ of champions) {
    const query = `
      INSERT INTO champion_stats (champion_name, role, league, games_played, wins, bans, total_kills, total_deaths, total_assists, icon_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (champion_name, role, league) DO UPDATE SET
        games_played = EXCLUDED.games_played,
        wins = EXCLUDED.wins,
        bans = EXCLUDED.bans,
        total_kills = EXCLUDED.total_kills,
        total_deaths = EXCLUDED.total_deaths,
        total_assists = EXCLUDED.total_assists,
        icon_url = EXCLUDED.icon_url,
        updated_at = NOW()
    `;
    
    const values = [
      champ.champion_name,
      champ.role,
      champ.league || 'GLOBAL',
      champ.games_played || 0,
      champ.wins || 0,
      champ.bans || 0,
      champ.kills || 0,
      champ.deaths || 0,
      champ.assists || 0,
      champ.icon_url || null
    ];
    
    await pool.query(query, values);
  }
  
  console.log('Estatísticas de campeões salvas com sucesso!');
}

function normalizePlayerData(rawPlayer) {
  const keys = Object.keys(rawPlayer);
  
  const findKey = (patterns) => {
    return keys.find(k => patterns.some(p => k.toLowerCase() === p.toLowerCase() || k.toLowerCase().includes(p.toLowerCase())));
  };

  const nameKey = findKey(['player', 'name', 'summoner']);
  const teamKey = findKey(['team', 'org']);
  const positionKey = findKey(['pos', 'position', 'role', 'lane']);
  const gamesKey = findKey(['games', 'gp', 'matches']);
  const kdaKey = findKey(['kda']);
  const kpKey = findKey(['kp', 'kill participation']);
  const goldKey = findKey(['gold per 10', 'gold@10', 'gpm']);
  const dpmKey = findKey(['dpm', 'damage per minute']);
  const cspmKey = findKey(['cspm', 'cs per minute', 'cs/min']);

  return {
    name: rawPlayer[nameKey] || 'Unknown',
    team_name: rawPlayer[teamKey] || null,
    position: rawPlayer[positionKey] || null,
    games_played: parseInt(rawPlayer[gamesKey]) || 0,
    kda: parseFloat(rawPlayer[kdaKey]) || 0,
    kill_participation: parseFloat(rawPlayer[kpKey]) || 0,
    gold_per_10: parseFloat(rawPlayer[goldKey]) || 0,
    dpm: parseFloat(rawPlayer[dpmKey]) || 0,
    cspm: parseFloat(rawPlayer[cspmKey]) || 0,
    league: rawPlayer.league,
    real_name: rawPlayer.real_name || null,
    image_url: rawPlayer.image_url || null
  };
}

function normalizeTeamData(rawTeam) {
  const keys = Object.keys(rawTeam);
  
  const findKey = (patterns) => {
    return keys.find(k => patterns.some(p => k.toLowerCase().includes(p)));
  };

  const nameKey = findKey(['team', 'name', 'org']);
  const gamesKey = findKey(['games', 'gp', 'matches']);
  const winsKey = findKey(['wins', 'w', 'win']);
  const lossesKey = findKey(['losses', 'l', 'loss']);

  return {
    name: rawTeam[nameKey] || 'Unknown',
    games_played: parseInt(rawTeam[gamesKey]) || 0,
    wins: parseInt(rawTeam[winsKey]) || 0,
    losses: parseInt(rawTeam[lossesKey]) || 0,
    league: rawTeam.league,
    logo_url: rawTeam.logo_url || null
  };
}

async function savePlayersToDB(players) {
  console.log(`Salvando ${players.length} jogadores no banco...`);
  
  for (const player of players) {
    const normalized = normalizePlayerData(player);
    
    const query = `
      INSERT INTO players (name, team_name, position, league, games_played, kda, kill_participation, gold_per_10, dpm, cspm, real_name, image_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (name, league) DO UPDATE SET
        team_name = EXCLUDED.team_name,
        position = EXCLUDED.position,
        games_played = EXCLUDED.games_played,
        kda = EXCLUDED.kda,
        kill_participation = EXCLUDED.kill_participation,
        gold_per_10 = EXCLUDED.gold_per_10,
        dpm = EXCLUDED.dpm,
        cspm = EXCLUDED.cspm,
        real_name = EXCLUDED.real_name,
        image_url = EXCLUDED.image_url,
        updated_at = NOW()
    `;
    
    const values = [
      normalized.name,
      normalized.team_name,
      normalized.position,
      normalized.league,
      normalized.games_played,
      normalized.kda,
      normalized.kill_participation,
      normalized.gold_per_10,
      normalized.dpm,
      normalized.cspm,
      normalized.real_name || null,
      normalized.image_url || null
    ];
    
    await pool.query(query, values);
  }
  
  console.log('Jogadores salvos com sucesso!');
}

async function saveTeamsToDB(teams) {
  console.log(`Salvando ${teams.length} times no banco...`);
  
  for (const team of teams) {
    const normalized = normalizeTeamData(team);
    
    const query = `
      INSERT INTO teams (name, league, games_played, wins, losses, logo_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (name, league) DO UPDATE SET
        games_played = EXCLUDED.games_played,
        wins = EXCLUDED.wins,
        losses = EXCLUDED.losses,
        logo_url = EXCLUDED.logo_url,
        updated_at = NOW()
    `;
    
    const values = [
      normalized.name,
      normalized.league,
      normalized.games_played,
      normalized.wins,
      normalized.losses,
      normalized.logo_url || null
    ];
    
    await pool.query(query, values);
  }
  
  console.log('Times salvos com sucesso!');
}

async function runExtraction() {
  try {
    console.log('=== Iniciando Pipeline de Extração ===');
    
    const players = await scrapePlayers();
    await savePlayersToDB(players);
    
    const teams = await scrapeTeams();
    await saveTeamsToDB(teams);
    
    const champions = await scrapeChampions();
    await saveChampionStatsToDB(champions);
    
    console.log('=== Pipeline Concluída com Sucesso ===');
  } catch (error) {
    console.error('Erro na pipeline de extração:', error);
    throw error;
  }
}

module.exports = { runExtraction, savePlayersToDB, saveTeamsToDB, saveChampionStatsToDB };
