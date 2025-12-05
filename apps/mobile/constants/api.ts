// .envファイルから環境変数を取得
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';

export const API_ENDPOINTS = {
  EXPENSES: `${API_BASE_URL}/api/expenses`,
  EXPENSE_STATUS: (id: number) => `${API_BASE_URL}/api/expenses/${id}/status`,
};
