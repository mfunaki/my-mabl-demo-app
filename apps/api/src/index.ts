import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

console.log('=== Application Starting ===');
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// データベース接続確認とテーブル自動作成
async function checkDatabase() {
  try {
    const client = await pool.connect();
    console.log('✓ Database connected successfully');
    
    // テーブルが存在しない場合は自動作成
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        applicant_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Database schema initialized');
    
    client.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
  }
}

checkDatabase();

const getUserName = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader || null;
};

// POST /api/migrate - 手動マイグレーション（互換性のため残す）
app.post('/api/migrate', async (req: Request, res: Response) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        applicant_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.json({ message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed', details: String(error) });
  }
});

// GET /api/expenses - 経費一覧取得
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const userName = getUserName(req);
    if (!userName) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = userName === 'manager'
      ? await pool.query('SELECT * FROM expenses ORDER BY created_at DESC')
      : await pool.query('SELECT * FROM expenses WHERE applicant_id = $1 ORDER BY created_at DESC', [userName]);

    res.json(result.rows.map(row => ({
      id: row.id,
      title: row.title,
      amount: row.amount,
      status: row.status,
      applicantId: row.applicant_id,
      createdAt: row.created_at,
    })));
  } catch (error) {
    console.error('GET /api/expenses error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// POST /api/expenses - 経費作成
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

    const result = await pool.query(
      'INSERT INTO expenses (title, amount, applicant_id) VALUES ($1, $2, $3) RETURNING *',
      [title, parseInt(amount), userName]
    );

    const expense = result.rows[0];
    res.status(201).json({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      status: expense.status,
      applicantId: expense.applicant_id,
      createdAt: expense.created_at,
    });
  } catch (error) {
    console.error('POST /api/expenses error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// PATCH /api/expenses/:id/status - ステータス更新
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

    const result = await pool.query(
      'UPDATE expenses SET status = $1 WHERE id = $2 RETURNING *',
      [status, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const expense = result.rows[0];
    res.json({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      status: expense.status,
      applicantId: expense.applicant_id,
      createdAt: expense.created_at,
    });
  } catch (error) {
    console.error('PATCH /api/expenses/:id/status error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

// POST /api/reset - データリセット
app.post('/api/reset', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM expenses');
    await pool.query('ALTER SEQUENCE expenses_id_seq RESTART WITH 1');
    res.json({ message: 'All expenses deleted' });
  } catch (error) {
    console.error('POST /api/reset error:', error);
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
