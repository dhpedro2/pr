
import React from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const FinancialSummary = () => {
  const { getSummary } = useTransactions();
  const summary = getSummary();

  const summaryCards = [
    {
      title: 'Saldo Atual',
      value: summary.netBalance,
      icon: <Wallet className="h-6 w-6" />,
      className: 'bg-primary/5',
      iconClass: 'text-primary',
    },
    {
      title: 'Receita Total',
      value: summary.totalIncome,
      icon: <ArrowUpRight className="h-6 w-6" />,
      className: 'bg-green-50',
      iconClass: 'text-income',
    },
    {
      title: 'Despesas Totais',
      value: summary.totalExpense,
      icon: <ArrowDownRight className="h-6 w-6" />,
      className: 'bg-red-50',
      iconClass: 'text-expense',
    },
    {
      title: 'Lucro Diário',
      value: summary.dailyProfit,
      icon: <Calendar className="h-6 w-6" />,
      className: 'bg-blue-50',
      iconClass: 'text-blue-500',
    },
    {
      title: 'Lucro Mensal',
      value: summary.monthlyProfit,
      icon: <TrendingUp className="h-6 w-6" />,
      className: 'bg-purple-50',
      iconClass: 'text-purple-500',
    },
    {
      title: 'Lucro Anual',
      value: summary.yearlyProfit,
      icon: <TrendingDown className="h-6 w-6" />,
      className: 'bg-amber-50',
      iconClass: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="border border-border shadow-soft hover:shadow-medium transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 75}ms` }}>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{card.title}</p>
              <h3 className={`text-2xl font-bold ${card.value < 0 ? 'text-expense' : card.value > 0 ? 'text-income' : ''}`}>
                {formatCurrency(card.value)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${card.className}`}>
              <div className={card.iconClass}>{card.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialSummary;
