#!/bin/bash

# Load environment variables from .env file
if [ ! -f ".env" ]; then
    echo "Error: .env file does not exist"
    exit 1
fi

# Read variables from .env
export $(grep -v '^#' .env | xargs)

# Verify required variables
if [ -z "$BACKUP_USER" ] || [ -z "$BACKUP_HOST" ]; then
    echo "Error: BACKUP_USER and BACKUP_HOST must be defined in .env"
    exit 1
fi

# Get current directory name
CURRENT_DIR=$(basename "$PWD")

# Generate archive name
ARCHIVE_NAME="${CURRENT_DIR}.tar.gz"

# Get local machine hostname
HOSTNAME=$(hostname)
ENV_REMOTE_NAME="${HOSTNAME}Env"

# Generate destination folder with date
DATE_DIR=$(date +%d-%m-%Y)
REMOTE_PATH="/home/${BACKUP_USER}/backups/${DATE_DIR}"

# Verify data folder exists
if [ ! -d "data" ]; then
    echo "Error: 'data' folder does not exist"
    exit 1
fi

# Create tar.gz archive
echo "Creating archive ${ARCHIVE_NAME}..."
tar -czf "${ARCHIVE_NAME}" data

# Verify archive creation
if [ $? -ne 0 ]; then
    echo "Error during archive creation"
    exit 1
fi

echo "Archive created successfully"

# Create remote folder if needed
echo "Creating remote folder ${REMOTE_PATH}..."
ssh "${BACKUP_USER}@${BACKUP_HOST}" "mkdir -p ${REMOTE_PATH}"

if [ $? -ne 0 ]; then
    echo "Error during remote folder creation"
    rm -f "${ARCHIVE_NAME}"
    exit 1
fi

# Send archive
echo "Sending archive to ${BACKUP_USER}@${BACKUP_HOST}:${REMOTE_PATH}..."
scp "${ARCHIVE_NAME}" "${BACKUP_USER}@${BACKUP_HOST}:${REMOTE_PATH}/"

if [ $? -ne 0 ]; then
    echo "Error during archive transfer"
    rm -f "${ARCHIVE_NAME}"
    exit 1
fi

echo "Archive sent successfully"

# Send .env file
echo "Sending .env file as ${ENV_REMOTE_NAME}..."
scp ".env" "${BACKUP_USER}@${BACKUP_HOST}:${REMOTE_PATH}/${ENV_REMOTE_NAME}"

if [ $? -ne 0 ]; then
    echo "Error during .env file transfer"
    rm -f "${ARCHIVE_NAME}"
    exit 1
fi

echo ".env file sent successfully"

# Remove local archive
echo "Removing local archive..."
rm -f "${ARCHIVE_NAME}"

if [ $? -eq 0 ]; then
    echo "Local archive removed"
    echo "Backup completed successfully"
else
    echo "Error during local archive removal"
    exit 1
fi
