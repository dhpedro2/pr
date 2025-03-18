import React, { useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency, getMonthName } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Charts = () => {
  const { transactions } = useTransactions();

  // Monthly data
  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0).map((_, i) => ({
      month: getMonthName(i),
      income: 0,
      expense: 0,
    }));

    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.getMonth();
      
      if (t.type === 'income') {
        months[month].income += t.amount;
      } else {
        months[month].expense += t.amount;
      }
    });

    return months;
  }, [transactions]);

  // Transaction type distribution
  const pieData = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return [
      { name: 'Receita', value: income },
      { name: 'Despesa', value: expense },
    ];
  }, [transactions]);

  // Daily data for current month
  const dailyData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = Array(daysInMonth).fill(0).map((_, i) => ({
      day: i + 1,
      balance: 0,
    }));
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(t => {
        const date = new Date(t.date);
        const day = date.getDate() - 1;
        days[day].balance += t.type === 'income' ? t.amount : -t.amount;
      });
    
    // Calculate cumulative balance
    let cumulativeBalance = 0;
    days.forEach((day, index) => {
      cumulativeBalance += day.balance;
      days[index].balance = cumulativeBalance;
    });
    
    return days;
  }, [transactions]);

  const COLORS = ['#34D399', '#F87171'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-md shadow-soft">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {formatCurrency(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Monthly Income/Expense Chart */}
      <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle>Receitas & Despesas Mensais</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#34D399" name="Receita" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#F87171" name="Despesa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income/Expense Distribution */}
      <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle>Distribuição de Receitas & Despesas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Balance Trend */}
      <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow duration-300 animate-fade-in col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tendência de Saldo Diário (Mês Atual)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#8884d8" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
