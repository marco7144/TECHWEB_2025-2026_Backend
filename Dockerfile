# Stage 1: Build del codice TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Immagine di esecuzione
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

# Copia i file compilati e le risorse necessarie
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config/words.json ./dist/config/words.json
COPY --from=builder /app/src/config/words.json ./src/config/words.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
