import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient, ExpenseStatus } from '@prisma/client';

// 環境変数を読み込み
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// CORS設定（Web/Mobileアプリからの接続を許可）
app.use(cors());
app.use(express.json());

// ヘルスチェック用エンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET /api/expenses - 経費一覧の取得
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    console.error('GET /api/expenses エラー:', error);
    res.status(500).json({ error: '経費の取得に失敗しました' });
  }
});

// POST /api/expenses - 経費の新規申請
app.post('/api/expenses', async (req: Request, res: Response) => {
  try {
    const { title, amount } = req.body;

    // バリデーション
    if (!title || !amount) {
      return res.status(400).json({ 
        error: 'titleとamountは必須です' 
      });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseInt(amount.toString(), 10),
      },
    });

    console.log(`✅ 新規経費を作成しました: ID=${expense.id}, Title=${expense.title}`);
    res.status(201).json(expense);
  } catch (error) {
    console.error('POST /api/expenses エラー:', error);
    res.status(500).json({ error: '経費の作成に失敗しました' });
  }
});

// PATCH /api/expenses/:id/status - ステータスの更新（承認/却下）
app.patch('/api/expenses/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // バリデーション
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'IDが不正です' });
    }

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ 
        error: 'statusは PENDING, APPROVED, REJECTED のいずれかである必要があります' 
      });
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: { status: status as ExpenseStatus },
    });

    console.log(`✅ 経費ステータスを更新しました: ID=${expense.id}, Status=${expense.status}`);
    res.json(expense);
  } catch (error) {
    console.error('PATCH /api/expenses/:id/status エラー:', error);
    res.status(404).json({ error: '経費が見つかりません' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Database: PostgreSQL (${process.env.DATABASE_URL?.split('@')[1]})`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
