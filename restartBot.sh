#!/bin/bash

# Récupérer le PID du processus
PID=$(ps -ef | grep "node medbot.js" | grep -v grep | awk '{print $2}')

# Vérifier si PID est vide
if [ -z "$PID" ]; then
    echo "Aucun processus 'node medbot.js' trouvé."
else
    # Tuer le processus
    echo "Processus trouvé : $PID. Terminaison..."
    echo $PID | xargs kill
fi