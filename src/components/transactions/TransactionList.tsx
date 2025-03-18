
import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatDate, formatCurrency } from '@/utils/dateUtils';
import { Transaction } from '@/types';
import { ArrowDownRight, ArrowUpRight, Search, Trash2, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import TransactionForm from './TransactionForm';
import { Badge } from '@/components/ui/badge';
import { CustomCalendar } from '@/components/ui/CustomCalendar';

const TransactionList = () => {
  const { transactions, filters, setFilters, deleteTransaction, getFilteredTransactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Handle filter changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, searchTerm: e.target.value });
  };
  
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setFilters({ 
      ...filters, 
      type: value === 'all' ? undefined : (value as 'income' | 'expense') 
    });
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setFilters({ ...filters, startDate: date });
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setFilters({ ...filters, endDate: date });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters({});
  };
  
  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions(filters);

  // Export transactions as CSV
  const exportTransactions = () => {
    const csvHeader = 'Data,Descrição,Valor,Tipo\n';
    const csvContent = filteredTransactions.map(t => {
      return `${formatDate(t.date)},"${t.description}",${t.amount},${t.type === 'income' ? 'Receita' : 'Despesa'}`;
    }).join('\n');
    
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transacoes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-soft border border-border">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Transações</span>
          <TransactionForm />
        </CardTitle>
        <CardDescription>
          Gerencie e visualize seu histórico de transações
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar transações..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 h-12" 
                onClick={resetFilters}
              >
                Resetar
              </Button>
              <Button 
                variant="outline" 
                className="h-12 aspect-square p-0" 
                onClick={exportTransactions}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomCalendar
              date={startDate}
              setDate={handleStartDateChange}
              label="Data Inicial"
              placeholder="Data inicial"
            />
            <CustomCalendar
              date={endDate}
              setDate={handleEndDateChange}
              label="Data Final"
              placeholder="Data final"
            />
          </div>
          
          {/* Transaction List */}
          <div className="space-y-2 mt-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação encontrada. Adicione uma nova transação para começar.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  onDelete={deleteTransaction} 
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredTransactions.length} de {transactions.length} transações
        </div>
      </CardFooter>
    </Card>
  );
};

// Transaction Item component
const TransactionItem = ({ 
  transaction, 
  onDelete 
}: { 
  transaction: Transaction; 
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-soft transition-shadow duration-200 animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          transaction.type === 'income' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {transaction.type === 'income' 
            ? <ArrowUpRight className="h-5 w-5" /> 
            : <ArrowDownRight className="h-5 w-5" />
          }
        </div>
        
        <div>
          <h4 className="font-medium text-sm">{transaction.description}</h4>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className={`font-medium ${
            transaction.type === 'income' ? 'text-income' : 'text-expense'
          }`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </p>
          <Badge variant="outline" className="text-xs">
            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
          </Badge>
        </div>
        
        <div className="flex space-x-1">
          <TransactionForm editTransaction={transaction} />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso irá excluir permanentemente esta transação. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(transaction.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
