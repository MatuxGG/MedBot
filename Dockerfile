FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Créer le dossier logs si nécessaire
RUN mkdir -p /app/logs && \
    mkdir -p ./volumes/mongo

# Lancer le serveur avec redirection vers logs
CMD ["sh", "-c", "node medbot.js >> /app/logs/logs.txt 2>&1"]
