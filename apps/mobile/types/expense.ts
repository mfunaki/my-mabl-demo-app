export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  status: ExpenseStatus;
  applicantId: string;
  createdAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
}
