#!/bin/bash

set -e

echo "=== Mobile Web Local Test Script ==="
echo ""

# 環境変数の確認
if [ -z "$EXPO_PUBLIC_API_URL" ]; then
  echo "Warning: EXPO_PUBLIC_API_URL not set, using default"
  export EXPO_PUBLIC_API_URL="http://localhost:8000"
fi

echo "EXPO_PUBLIC_API_URL: $EXPO_PUBLIC_API_URL"
echo ""

# 依存関係のインストール
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps

# Webビルド
echo ""
echo "=== Building for web ==="
npx expo export:web

# ビルド結果の確認
echo ""
echo "=== Build output ==="
ls -lh web-build/

# Dockerイメージのビルド（オプション）
if command -v docker &> /dev/null; then
  echo ""
  echo "=== Building Docker image ==="
  
  cat > Dockerfile.test << 'DOCKER_EOF'
FROM nginx:alpine
COPY web-build /usr/share/nginx/html
RUN echo 'server { listen 8080; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
DOCKER_EOF
  
  docker build -t expense-mobile-web:test -f Dockerfile.test .
  
  echo ""
  echo "=== Docker image ready ==="
  echo "Run with: docker run -p 8080:8080 expense-mobile-web:test"
  echo "Then open: http://localhost:8080"
  
  rm Dockerfile.test
else
  echo ""
  echo "=== Docker not available, skipping container build ==="
  echo "You can serve the web-build directory with:"
  echo "  cd web-build && python3 -m http.server 8080"
  echo "  or: npx serve web-build -p 8080"
fi

echo ""
echo "=== Test complete ==="
