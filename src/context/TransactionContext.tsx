
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, TransactionFilters, FinancialSummary } from '@/types';
import { toast } from '@/components/ui/sonner';
import { formatCurrency } from '@/utils/dateUtils';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getFilteredTransactions: (filters: TransactionFilters) => Transaction[];
  getSummary: () => FinancialSummary;
  filters: TransactionFilters;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [loading, setLoading] = useState(true);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        // Convert date strings to Date objects when loading from storage
        const parsed = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(parsed);
      } catch (error) {
        console.error('Error parsing transactions:', error);
        toast.error('Error loading saved transactions');
      }
    }
    setLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success(`${transaction.type === 'income' ? 'Income' : 'Expense'} added: ${formatCurrency(transaction.amount)}`);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast.success('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  const getFilteredTransactions = (filters: TransactionFilters): Transaction[] => {
    return transactions.filter(transaction => {
      // Filter by date range
      if (filters.startDate && new Date(transaction.date) < filters.startDate) return false;
      if (filters.endDate && new Date(transaction.date) > filters.endDate) return false;

      // Filter by type
      if (filters.type && transaction.type !== filters.type) return false;

      // Filter by category
      if (filters.category && transaction.category !== filters.category) return false;

      // Filter by search term
      if (filters.searchTerm && 
          !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;

      return true;
    });
  };

  const getSummary = (): FinancialSummary => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // All transactions
    const allIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const allExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Daily transactions
    const dailyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfDay)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const dailyExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfDay)
      .reduce((sum, t) => sum + t.amount, 0);

    // Monthly transactions
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    // Yearly transactions
    const yearlyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const yearlyExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfYear)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: allIncome,
      totalExpense: allExpense,
      netBalance: allIncome - allExpense,
      dailyProfit: dailyIncome - dailyExpense,
      monthlyProfit: monthlyIncome - monthlyExpense,
      yearlyProfit: yearlyIncome - yearlyExpense,
    };
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getFilteredTransactions,
        getSummary,
        filters,
        setFilters,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
