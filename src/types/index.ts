export type TransactionType = "income" | "expense";

export const CATEGORIES = {
  income:  ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"],
} as const;

export interface Transaction {
  id:        string;
  title:     string;
  amount:    number;
  type:      TransactionType;
  category:  string;
  date:      string;
  note?:     string | null;
  userId:    string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id:    string;
  name:  string;
  email: string;
}

export type CreateTransactionPayload = Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">;
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface DashboardStats {
  totalIncome:  number;
  totalExpense: number;
  netBalance:   number;
  transactions: number;
}

export interface CategoryStat {
  name:  string;
  value: number;
  color: string;
}

export interface MonthlyTrend {
  month:   string;
  income:  number;
  expense: number;
}

export interface ApiResponse<T> {
  data:     T;
  success:  boolean;
  message?: string;
}
