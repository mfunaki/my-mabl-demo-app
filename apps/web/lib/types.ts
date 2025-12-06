export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  status: ExpenseStatus;
  applicantId: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
  role: 'manager';
}
