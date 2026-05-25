const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Testando conexão...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Conexão OK:', res.rows[0].now);
    
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('📋 Tabelas:', tables.rows.map(t => t.table_name).join(', '));
    
    await client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Erro DB:', err.message);
    process.exit(1);
  }
}
main();
