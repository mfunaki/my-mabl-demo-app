import axios from 'axios';
import { Expense, ExpenseStatus } from './types';

export const getApiUrl = (isServer: boolean = false): string => {
  if (isServer) {
    const url = process.env.INTERNAL_API_URL || 'http://backend:4000';
    console.log('[API] Server-side API URL:', url);
    return url;
  }
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  console.log('[API] Client-side API URL:', url);
  return url;
};

export const createApiClient = (isServer: boolean = false, userName: string = 'manager') => {
  const baseURL = getApiUrl(isServer);
  console.log('[API] Creating client with baseURL:', baseURL, 'isServer:', isServer);
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userName,
    },
    timeout: 10000,
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
