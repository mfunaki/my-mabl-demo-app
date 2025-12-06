import { expenseApi } from '@/lib/api';
import { ExpenseTable } from './ExpenseTable';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const expenses = await expenseApi.getAll(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="dashboard-title">
            経費承認ダッシュボード
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ExpenseTable initialExpenses={expenses} />
      </main>
    </div>
  );
}
