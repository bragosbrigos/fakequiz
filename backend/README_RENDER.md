# Backend - Node.js com Puppeteer e node-cron

## Deploy no Render

### Pré-requisitos
- Conta no [Render](https://render.com)
- Banco de dados PostgreSQL (pode ser o próprio Render PostgreSQL ou outro provedor)

### Passos para Deploy

1. **Prepare seu repositório**
   - Certifique-se de que todo o código está no Git
   - O backend está na pasta `/backend`

2. **Crie um Web Service no Render**
   - Acesse https://render.com/dashboard
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório Git

3. **Configure o serviço**
   - **Name**: escolha um nome para seu serviço
   - **Region**: selecione a região mais próxima
   - **Branch**: main (ou sua branch principal)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build:frontend`
   - **Start Command**: `npm run start:prod`

4. **Variáveis de Ambiente**
   Adicione as seguintes variáveis no painel do Render:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: sua string de conexão PostgreSQL
   - `PORT`: 3001 (opcional, o Render define automaticamente)

5. **Plano**
   - **Importante**: O plano gratuito do Render faz o servidor "dormir" após 15 minutos de inatividade
   - Para produção com node-cron funcionando 24/7, use o plano **Starter** ($7/mês)
   - No plano gratuito, os jobs agendados não rodarão consistentemente

6. **Puppeteer no Render**
   - O Render já inclui as dependências necessárias para o Puppeteer
   - Se tiver problemas, adicione um script de build customizado

### Estrutura do Projeto

```
/backend
├── src/
│   ├── index.js          # Servidor Express + serve frontend em produção
│   ├── config/
│   ├── routes/
│   └── services/
├── package.json
├── Procfile              # Configuração de deploy
└── .env.example          # Modelo de variáveis de ambiente

/frontend
└── dist/                 # Gerado após build (servido pelo backend)
```

### Como Funciona em Produção

1. O Render executa `npm run build:frontend` que:
   - Instala dependências do frontend
   - Roda `vite build` gerando a pasta `dist`

2. O backend inicia com `npm run start:prod`
   - O Express serve os arquivos estáticos do frontend da pasta `dist`
   - Todas as rotas `/api/*` são tratadas pelas rotas da API
   - Todas as outras rotas retornam o `index.html` do React (SPA routing)

3. O node-cron roda continuamente (apenas em planos pagos)

### Monitoramento

- Acesse `/health` para verificar se o serviço está online
- Use os logs do Render para debug
- Configure alerts no dashboard do Render

### Dicas Importantes

⚠️ **Plano Gratuito**: Não é recomendado para esta aplicação porque:
- O servidor dorme após 15 min de inatividade
- node-cron não funciona corretamente
- Puppeteer pode falhar ao acordar o servidor

✅ **Plano Starter ($7/mês)**: Ideal para produção
- Servidor 24/7
- node-cron funciona normalmente
- Melhor performance com Puppeteer

### Troubleshooting

**Problema**: Frontend não carrega
- Verifique se o build do frontend foi executado
- Confirme que `NODE_ENV=production` está definido

**Problema**: API retorna 404
- Verifique se as rotas estão registradas corretamente
- Confira os logs do Render

**Problema**: Puppeteer não funciona
- O Render suporta Puppeteer nativamente
- Se necessário, use `puppeteer-core` com browser externo
