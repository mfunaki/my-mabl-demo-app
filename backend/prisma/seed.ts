import { PrismaClient, ExpenseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータを投入中...');

  // 既存データをクリア
  await prisma.expense.deleteMany();
  console.log('✅ 既存データをクリアしました');

  // デモ用の初期データを作成
  const expenses = await prisma.expense.createMany({
    data: [
      {
        title: 'タクシー代',
        amount: 3500,
        status: ExpenseStatus.PENDING,
      },
      {
        title: '文房具購入',
        amount: 2800,
        status: ExpenseStatus.APPROVED,
      },
      {
        title: '出張宿泊費',
        amount: 15000,
        status: ExpenseStatus.PENDING,
      },
      {
        title: 'クライアント接待',
        amount: 8000,
        status: ExpenseStatus.REJECTED,
      },
      {
        title: '会議室レンタル',
        amount: 12000,
        status: ExpenseStatus.APPROVED,
      },
    ],
  });

  console.log(`✅ ${expenses.count}件のシードデータを投入しました`);
}

main()
  .catch((e) => {
    console.error('❌ シードデータ投入エラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
