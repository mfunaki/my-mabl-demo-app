#!/bin/sh
set -e

echo "=== Environment Check ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL is set: $([ -z "$DATABASE_URL" ] && echo "NO" || echo "YES")"

echo "=== Skipping Prisma CLI migration (will sync on app startup) ==="
echo "=== Starting application ==="
exec node dist/index.js
