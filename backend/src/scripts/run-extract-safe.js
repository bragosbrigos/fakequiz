// Força uso do chromium do sistema
process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium-browser';

const { runExtraction } = require('../../backend/src/services/dataPipeline');

console.log('🚀 Iniciando extração...');
runExtraction()
  .then(res => {
    console.log('✅ Sucesso:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FALHA NA EXTRAÇÃO:');
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  });
