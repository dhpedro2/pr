
import React, { useState } from 'react';
import { CustomCalendar } from '@/components/ui/CustomCalendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransactions } from '@/context/TransactionContext';
import { Transaction, TransactionType } from '@/types';
import { PlusCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionFormProps {
  editTransaction?: Transaction;
  onComplete?: () => void;
}

const TransactionForm = ({ editTransaction, onComplete }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    editTransaction ? new Date(editTransaction.date) : new Date()
  );
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [amount, setAmount] = useState(editTransaction?.amount.toString() || '');
  const [type, setType] = useState<TransactionType>(editTransaction?.type || 'income');
  const [errors, setErrors] = useState({
    description: false,
    amount: false,
    date: false,
  });

  const validateForm = () => {
    const newErrors = {
      description: description.trim() === '',
      amount: amount.trim() === '' || isNaN(Number(amount)) || Number(amount) <= 0,
      date: !date,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const transaction = {
      date: date!,
      description,
      amount: Number(amount),
      type,
    };
    
    if (editTransaction) {
      updateTransaction({
        ...transaction,
        id: editTransaction.id,
        category: editTransaction.category,
      });
    } else {
      addTransaction(transaction);
    }
    
    resetForm();
    setOpen(false);
    if (onComplete) onComplete();
  };
  
  const resetForm = () => {
    if (!editTransaction) {
      setDate(new Date());
      setDescription('');
      setAmount('');
      setType('income');
    }
    setErrors({ description: false, amount: false, date: false });
  };

  const dialogTitle = editTransaction ? 'Editar Transação' : 'Adicionar Nova Transação';
  const buttonText = editTransaction ? 'Atualizar' : 'Adicionar';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editTransaction ? (
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            Editar
          </Button>
        ) : (
          <Button className="gap-1.5 animate-fade-in">
            <PlusCircle className="h-4 w-4" />
            Adicionar Transação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para registrar sua transação.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <CustomCalendar
              date={date}
              setDate={setDate}
              label="Data"
              placeholder="Selecione a data da transação"
            />
            {errors.date && <p className="text-destructive text-sm">Por favor, selecione uma data</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Material de escritório, Pagamento de cliente"
              className={cn(
                "h-12 transition-all duration-200",
                errors.description && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.description && <p className="text-destructive text-sm">Por favor, insira uma descrição</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              step="0.01"
              min="0"
              className={cn(
                "h-12 transition-all duration-200",
                errors.amount && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.amount && <p className="text-destructive text-sm">Por favor, insira um valor válido</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Transação</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TransactionType)}
            >
              <SelectTrigger className="h-12 transition-all duration-200">
                <SelectValue placeholder="Selecione o tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="text-income font-medium">Receita</SelectItem>
                <SelectItem value="expense" className="text-expense font-medium">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="gap-1"
            >
              <XCircle className="h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Helper function for conditional class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default TransactionForm;
