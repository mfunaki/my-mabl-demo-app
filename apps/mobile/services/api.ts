import axios from 'axios';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { Expense, ExpenseFormData } from '../types/expense';

// Androidエミュレータ用の特別なIPアドレス
const getApiUrl = () => {
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  
  if (configUrl) {
    console.log('[API] Using config URL:', configUrl);
    return configUrl;
  }
  
  // デフォルト: プラットフォームに応じて切り替え
  if (Platform.OS === 'android') {
    console.log('[API] Using Android default: http://10.0.2.2:4000');
    return 'http://10.0.2.2:4000';
  }
  
  console.log('[API] Using default: http://localhost:4000');
  return 'http://localhost:4000';
};

const API_URL = 'https://expense-app-api-ixi7x7b23a-an.a.run.app';

console.log('[Mobile API] Platform:', Platform.OS);
console.log('[Mobile API] Using API URL:', API_URL);

const createApiClient = (userName: string = 'employee') => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userName,
    },
    timeout: 30000, // タイムアウトを30秒に延長
  });
};

export const expenseApi = {
  getAll: async (userName: string = 'employee'): Promise<Expense[]> => {
    try {
      const api = createApiClient(userName);
      console.log('[API] Fetching expenses for:', userName);
      const response = await api.get<Expense[]>('/api/expenses');
      console.log('[API] Expenses fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('[API] Get expenses error:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        Alert.alert('API Error', `Failed to fetch expenses: ${message}`);
      }
      throw error;
    }
  },

  create: async (data: ExpenseFormData, userName: string = 'employee'): Promise<Expense> => {
    try {
      const api = createApiClient(userName);
      console.log('[API] Creating expense:', data);
      const response = await api.post<Expense>('/api/expenses', data);
      console.log('[API] Expense created:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API] Create expense error:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        Alert.alert('API Error', `Failed to create expense: ${message}`);
      }
      throw error;
    }
  },

  reset: async (): Promise<void> => {
    try {
      const api = createApiClient('employee');
      console.log('[API] Resetting data');
      await api.post('/api/reset');
      console.log('[API] Data reset successful');
    } catch (error) {
      console.error('[API] Reset error:', error);
      throw error;
    }
  },
};
