export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  status: ExpenseStatus;
  createdAt: string;
}
