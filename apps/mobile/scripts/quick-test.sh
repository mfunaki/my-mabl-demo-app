#!/bin/bash

set -e

echo "=== Quick Mobile Web Test ==="
echo ""

export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://localhost:8000}"
echo "API URL: $EXPO_PUBLIC_API_URL"

echo ""
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps

echo ""
echo "=== Building for web ==="
npx expo export:web

echo ""
echo "=== Build complete ==="
ls -lh web-build/

echo ""
echo "=== Starting local server ==="
echo "Open http://localhost:8080 in your browser"
echo "Press Ctrl+C to stop"
echo ""

cd web-build
npx serve -p 8080
