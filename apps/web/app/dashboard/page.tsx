'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Expense } from '@/types/expense';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証チェック
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchExpenses();
  }, [router]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('経費データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (response.ok) {
        const updatedExpense = await response.json();
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === id ? updatedExpense : exp))
        );
      }
    } catch (error) {
      console.error('承認処理に失敗しました:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (response.ok) {
        const updatedExpense = await response.json();
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === id ? updatedExpense : exp))
        );
      }
    } catch (error) {
      console.error('却下処理に失敗しました:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: '申請中',
      APPROVED: '承認済',
      REJECTED: '却下',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">経費管理ダッシュボード</h1>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ログアウト
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイトル</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">申請日時</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} data-testid={`expense-row-${expense.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{expense.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">¥{expense.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span data-testid={`status-text-${expense.id}`}>
                        {getStatusBadge(expense.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(expense.createdAt).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      {expense.status === 'PENDING' && (
                        <>
                          <button
                            data-testid={`approve-button-${expense.id}`}
                            onClick={() => handleApprove(expense.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-xs font-medium"
                          >
                            承認
                          </button>
                          <button
                            data-testid={`reject-button-${expense.id}`}
                            onClick={() => handleReject(expense.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs font-medium"
                          >
                            却下
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {expenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              申請された経費がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
