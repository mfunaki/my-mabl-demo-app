#!/bin/sh
set -e

echo "=== Environment Check ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL is set: $([ -z "$DATABASE_URL" ] && echo "NO" || echo "YES")"
if [ ! -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL prefix: ${DATABASE_URL:0:30}..."
  # URLの形式チェック
  if echo "$DATABASE_URL" | grep -q "postgresql://"; then
    echo "DATABASE_URL format looks correct (starts with postgresql://)"
  else
    echo "WARNING: DATABASE_URL does not start with postgresql://"
  fi
fi

echo "=== Starting database migration ==="
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set, skipping migration"
else
  npx prisma db push --accept-data-loss --skip-generate || {
    echo "Migration failed with exit code $?, but continuing..."
  }
fi

echo "=== Starting application ==="
exec node dist/index.js
