const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  const client = await pool.connect();
  const tables = ['teams', 'players', 'champion_stats', 'matches'];
  
  for (const t of tables) {
    try {
      const res = await client.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`📊 ${t}: ${res.rows[0].count} registros`);
    } catch (e) {
      console.log(`⚠️ ${t}: Erro ao contar`);
    }
  }
  
  await client.release();
  await pool.end();
}
main();
