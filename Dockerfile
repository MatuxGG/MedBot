FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .


# Créer le dossier logs
RUN mkdir -p /app/logs

# Script de démarrage avec redirection
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node medbot.js >> /app/logs/logs.txt 2>&1' >> /app/start.sh && \
    chmod +x /app/start.sh
