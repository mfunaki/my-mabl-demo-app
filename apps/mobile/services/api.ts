import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Expense, ExpenseFormData } from '../types/expense';

// Androidエミュレータ用の特別なIPアドレス
const getApiUrl = () => {
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  
  if (configUrl) {
    return configUrl;
  }
  
  // デフォルト: プラットフォームに応じて切り替え
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  
  return 'http://localhost:4000';
};

const API_URL = getApiUrl();

console.log('[Mobile API] Platform:', Platform.OS);
console.log('[Mobile API] Using API URL:', API_URL);

const createApiClient = (userName: string = 'employee') => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userName,
    },
    timeout: 10000,
  });
};

export const expenseApi = {
  getAll: async (userName: string = 'employee'): Promise<Expense[]> => {
    const api = createApiClient(userName);
    const response = await api.get<Expense[]>('/api/expenses');
    return response.data;
  },

  create: async (data: ExpenseFormData, userName: string = 'employee'): Promise<Expense> => {
    const api = createApiClient(userName);
    const response = await api.post<Expense>('/api/expenses', data);
    return response.data;
  },

  reset: async (): Promise<void> => {
    const api = createApiClient('employee');
    await api.post('/api/reset');
  },
};
