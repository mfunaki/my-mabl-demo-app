import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

console.log('=== Application Starting ===');
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30) + '...');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'error', 'warn'],
});
const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

const getUserName = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader || null;
};

// GET /api/expenses - 経費一覧取得
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const userName = getUserName(req);
    if (!userName) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expenses = await prisma.expense.findMany({
      where: userName === 'manager' ? {} : { applicantId: userName },
      orderBy: { createdAt: 'desc' }
    });

    res.json(expenses);
  } catch (error) {
    console.error('GET /api/expenses error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// POST /api/expenses - 経費作成 (Employeeのみ)
app.post('/api/expenses', async (req: Request, res: Response) => {
  try {
    const userName = getUserName(req);
    if (!userName || userName === 'manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, amount } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseInt(amount),
        applicantId: userName,
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('POST /api/expenses error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// PATCH /api/expenses/:id/status - ステータス更新 (Managerのみ)
app.patch('/api/expenses/:id/status', async (req: Request, res: Response) => {
  try {
    const userName = getUserName(req);
    if (!userName || userName !== 'manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(expense);
  } catch (error) {
    console.error('PATCH /api/expenses/:id/status error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// POST /api/reset - データリセット
app.post('/api/reset', async (req: Request, res: Response) => {
  try {
    await prisma.expense.deleteMany({});
    await prisma.$executeRaw`ALTER SEQUENCE expenses_id_seq RESTART WITH 1`;
    res.json({ message: 'All expenses deleted' });
  } catch (error) {
    console.error('POST /api/reset error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// GET /api/reset - データリセット (ブラウザアクセス用)
app.get('/api/reset', async (req: Request, res: Response) => {
  try {
    await prisma.expense.deleteMany({});
    await prisma.$executeRaw`ALTER SEQUENCE expenses_id_seq RESTART WITH 1`;
    res.json({ message: 'All expenses deleted' });
  } catch (error) {
    console.error('GET /api/reset error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
