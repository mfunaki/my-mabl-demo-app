import axios from 'axios';
import { Expense, ExpenseStatus } from './types';

export const getApiUrl = (isServer: boolean = false): string => {
  if (isServer) {
    return process.env.INTERNAL_API_URL || 'http://backend:4000';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
};

export const createApiClient = (isServer: boolean = false, userName: string = 'manager') => {
  return axios.create({
    baseURL: getApiUrl(isServer),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userName,
    },
  });
};

export const expenseApi = {
  getAll: async (isServer: boolean = false): Promise<Expense[]> => {
    const api = createApiClient(isServer, 'manager');
    const response = await api.get<Expense[]>('/api/expenses');
    return response.data;
  },

  updateStatus: async (id: number, status: ExpenseStatus): Promise<Expense> => {
    const api = createApiClient(false, 'manager');
    const response = await api.patch<Expense>(`/api/expenses/${id}/status`, { status });
    return response.data;
  },

  reset: async (): Promise<void> => {
    const api = createApiClient(false, 'manager');
    await api.post('/api/reset');
  },
};
