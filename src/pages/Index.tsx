
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FinancialSummary from '@/components/dashboard/FinancialSummary';
import Charts from '@/components/dashboard/Charts';
import TransactionList from '@/components/transactions/TransactionList';
import { TransactionProvider } from '@/context/TransactionContext';
import { getCurrentMonthAndYear } from '@/utils/dateUtils';

const Index = () => {
  return (
    <TransactionProvider>
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
            <p className="text-muted-foreground mt-1">
              Visão financeira para {getCurrentMonthAndYear()}
            </p>
          </div>
          
          <FinancialSummary />
          <Charts />
          <TransactionList />
        </div>
      </DashboardLayout>
    </TransactionProvider>
  );
};

export default Index;
