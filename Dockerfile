# Usando imagem base oficial do Node
FROM node:18-slim

# Instalar dependências do sistema necessárias para o Puppeteer/Chrome
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-tlwg-loma-otf \
    fonts-freefont-ttf \
    libxshmfence1 \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxtst6 \
    libasound2 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Definir variável para o Puppeteer encontrar o Chromium do sistema
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar apenas o package-lock primeiro para cache
COPY backend/package*.json ./
RUN npm ci --only=production

# Copiar o resto do código do backend
COPY backend/src ./src
COPY backend/index.js ./

# Expor a porta (o Railway define a porta via ENV)
EXPOSE 3001

# Comando de início
CMD ["node", "index.js"]
