FROM node:20-alpine

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Prisma Clientを生成
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
