#!/bin/sh
set -e

echo "Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "DATABASE_URL is set (masked): postgresql://****"

echo "Starting database migration..."
npx prisma db push --accept-data-loss --skip-generate || {
  echo "Migration failed, but continuing..."
}

echo "Starting application..."
exec node dist/index.js
