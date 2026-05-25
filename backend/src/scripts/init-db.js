const { createTables } = require('../config/schema');

const initDatabase = async () => {
  try {
    console.log('🔄 Criando tabelas no banco de dados...');
    await createTables();
    console.log('✅ Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
};

initDatabase();
