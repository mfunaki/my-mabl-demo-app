'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Expense } from '@/lib/types';
import { expenseApi } from '@/lib/api';
import { isAuthenticated, logout } from '@/lib/auth';

interface ExpenseTableProps {
  initialExpenses: Expense[];
}

export function ExpenseTable({ initialExpenses }: ExpenseTableProps) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleApprove = async (id: number) => {
    if (!confirm('この経費を承認しますか?')) return;

    try {
      setLoading(true);
      setError(null);
      const updated = await expenseApi.updateStatus(id, 'APPROVED');
      setExpenses(expenses.map(exp => exp.id === id ? updated : exp));
    } catch (err) {
      setError('承認処理に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('すべての経費データを削除しますか?')) return;

    try {
      setLoading(true);
      setError(null);
      await expenseApi.reset();
      setExpenses([]);
    } catch (err) {
      setError('リセット処理に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = expenses.filter(exp => exp.status === 'PENDING').length;

  return (
    <div className="px-4 sm:px-0">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" data-testid="error-message">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-lg font-semibold" data-testid="total-count">
            件数: {expenses.length}件 (承認待ち: {pendingCount}件)
          </span>
          <span className="ml-4 text-lg font-semibold" data-testid="total-amount">
            合計: ¥{totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
            data-testid="reset-button"
          >
            全データ削除
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            data-testid="logout-button"
          >
            ログアウト
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {expenses.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500" data-testid="empty-message">
            経費データがありません
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} data-testid={`expense-row-${expense.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`expense-id-${expense.id}`}>
                    {expense.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`expense-title-${expense.id}`}>
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`expense-applicant-${expense.id}`}>
                    {expense.applicantId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`expense-amount-${expense.id}`}>
                    ¥{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid={`expense-status-${expense.id}`}>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`expense-created-${expense.id}`}>
                    {new Date(expense.createdAt).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {expense.status === 'PENDING' && (
                      <button
                        onClick={() => handleApprove(expense.id)}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        data-testid={`approve-button-${expense.id}`}
                      >
                        承認
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
