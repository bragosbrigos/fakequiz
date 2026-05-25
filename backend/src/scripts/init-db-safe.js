const { createTables } = require('../../backend/src/config/schema');

createTables()
  .then(() => {
    console.log('✅ Banco inicializado!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro init:', err.message);
    process.exit(1);
  });
