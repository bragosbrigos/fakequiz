require('dotenv').config();
const { Pool } = require('pg');
// Ajuste o caminho conforme a estrutura real dos seus serviços
const scrapingService = require('../services/scrapingService'); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  console.log('🔧 Iniciando banco de dados...');

  const client = await pool.connect();

    // 2. Executar Scrapes em sequência
    
    // A. Scrapar Campeões (Dados estáticos)
    console.log('\n🚀 [1/4] Iniciando scrape de Campeões...');
    try {
      if (scrapingService.scrapeChampions) {
        await scrapingService.scrapeChampions();
        console.log('✅ Campeões processados.');
      } else {
        console.log('⚠️ Função scrapeChampions não encontrada no serviço.');
      }
    } catch (err) {
      console.error('❌ Erro ao scrapear campeões:', err.message);
    }

    // B. Scrapar Times (Necessário antes dos jogadores)
    console.log('\n🚀 [2/4] Iniciando scrape de Times...');
    try {
      if (scrapingService.scrapeTeams) {
        await scrapingService.scrapeTeams();
        console.log('✅ Times processados.');
      } else {
        console.log('⚠️ Função scrapeTeams não encontrada no serviço.');
      }
    } catch (err) {
      console.error('❌ Erro ao scrapear times:', err.message);
    }

    // C. Scrapar Jogadores (Depende dos times já estarem no banco)
    console.log('\n🚀 [3/4] Iniciando scrape de Jogadores...');
    try {
      if (scrapingService.scrapePlayers) {
        await scrapingService.scrapePlayers();
        console.log('✅ Jogadores processados.');
      } else {
        console.log('⚠️ Função scrapePlayers não encontrada no serviço.');
      }
    } catch (err) {
      console.error('❌ Erro ao scrapear jogadores:', err.message);
    }

    console.log('\n🎉 Inicialização e Seed concluídos!');

  } catch (error) {
    console.error('💥 Erro crítico na inicialização:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
    console.log('🔌 Conexão com banco fechada.');
  }
}

// Executar
initDatabase()
  .then(() => {
    console.log('🏁 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Falha na execução:', err);
    process.exit(1);
  });
