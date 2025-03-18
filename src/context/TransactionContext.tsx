
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, TransactionFilters, FinancialSummary } from '@/types';
import { toast } from "@/hooks/use-toast";
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

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(parsed);
      } catch (error) {
        console.error('Erro ao analisar transações:', error);
        toast({
          title: "Erro ao carregar transações salvas",
          variant: "destructive"
        });
      }
    }
    setLoading(false);
  }, []);

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
    toast({
      title: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} adicionada`,
      description: formatCurrency(transaction.amount)
    });
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast({
      title: "Transação atualizada"
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação excluída"
    });
  };

  const getFilteredTransactions = (filters: TransactionFilters): Transaction[] => {
    return transactions.filter(transaction => {
      if (filters.startDate && new Date(transaction.date) < filters.startDate) return false;
      if (filters.endDate && new Date(transaction.date) > filters.endDate) return false;

      if (filters.type && transaction.type !== filters.type) return false;

      if (filters.category && transaction.category !== filters.category) return false;

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

    const allIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const allExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const dailyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfDay)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const dailyExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfDay)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

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
    throw new Error('useTransactions deve ser usado dentro de um TransactionProvider');
  }
  return context;
};
