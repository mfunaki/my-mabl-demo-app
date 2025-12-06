#!/bin/sh
set -e

echo "Starting database migration..."
npx prisma db push --accept-data-loss --skip-generate

echo "Starting application..."
exec node dist/index.js
