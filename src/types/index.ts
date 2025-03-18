
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  category?: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  category?: string;
  searchTerm?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  dailyProfit: number;
  monthlyProfit: number;
  yearlyProfit: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface UserSettings {
  currency: string;
  language: string;
  notificationThreshold: number;
  categories: string[];
}
