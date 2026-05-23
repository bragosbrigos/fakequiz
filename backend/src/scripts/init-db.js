require('dotenv').config();
const { Pool } = require('pg');
const { scrapeAllChampions } = require('../services/scrapeService');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  console.log('🔧 Iniciando banco de dados...');

  const client = await pool.connect();

  try {
    // Criar tabelas se não existirem
    await client.query(`
      CREATE TABLE IF NOT EXISTS champions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255),
        image_url TEXT,
        roles TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        match_id VARCHAR(100) UNIQUE NOT NULL,
        game_mode VARCHAR(50),
        game_type VARCHAR(50),
        map_id INTEGER,
        game_duration INTEGER,
        game_creation BIGINT,
        queue_id INTEGER,
        season_id INTEGER,
        platform_id VARCHAR(10),
        participants JSONB,
        teams JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS player_stats (
        id SERIAL PRIMARY KEY,
        summoner_name VARCHAR(100) NOT NULL,
        summoner_id VARCHAR(100) UNIQUE,
        account_id VARCHAR(100),
        puuid VARCHAR(100) UNIQUE,
        profile_icon_id INTEGER,
        revision_date BIGINT,
        summoner_level INTEGER,
        tier VARCHAR(20),
        rank VARCHAR(20),
        league_points INTEGER,
        wins INTEGER,
        losses INTEGER,
        hot_streak BOOLEAN,
        veteran BOOLEAN,
        fresh_blood BOOLEAN,
        inactive BOOLEAN,
        last_match_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_champions_name ON champions(name);
      CREATE INDEX IF NOT EXISTS idx_matches_match_id ON matches(match_id);
      CREATE INDEX IF NOT EXISTS idx_matches_game_creation ON matches(game_creation);
      CREATE INDEX IF NOT EXISTS idx_player_stats_puuid ON player_stats(puuid);
      CREATE INDEX IF NOT EXISTS idx_player_stats_summoner_name ON player_stats(summoner_name);
    `);

    console.log('✅ Tabelas criadas com sucesso!');

    // Executar scrape inicial
    console.log('🚀 Iniciando scrape inicial...');
    const result = await scrapeAllChampions();

    if (result.success) {
      console.log(`✅ Scrape concluído! ${result.data.champions.length} campeões processados.`);
    } else {
      console.error('❌ Erro no scrape:', result.error);
    }

  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar
initDatabase()
  .then(() => {
    console.log('🎉 Inicialização concluída com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Falha na inicialização:', err);
    process.exit(1);
  });
