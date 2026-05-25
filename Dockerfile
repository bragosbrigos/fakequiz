# Use uma imagem base mais completa para evitar instalações massivas de libs
FROM node:18-bookworm

# Defina variáveis de ambiente para evitar prompts interativos e configurar o Chrome
ENV DEBIAN_FRONTEND=noninteractive \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Instale apenas o essencial de uma vez para reduzir camadas e tempo
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY backend/package*.json ./

# Instale as dependências do Node
RUN npm ci --only=production

# Copie o restante do código do backend
COPY backend/src ./src
COPY backend/index.js ./
# Se houver outros arquivos na raiz do backend necessários, copie-os também
# COPY backend/config ./config

# Exponha a porta (o Railway injeta a PORT, mas é bom declarar)
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "index.js"]
