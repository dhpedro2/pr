
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

  const dialogTitle = editTransaction ? 'Edit Transaction' : 'Add New Transaction';
  const buttonText = editTransaction ? 'Update' : 'Add';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editTransaction ? (
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            Edit
          </Button>
        ) : (
          <Button className="gap-1.5 animate-fade-in">
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Fill in the details below to record your transaction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <CustomCalendar
              date={date}
              setDate={setDate}
              label="Date"
              placeholder="Select transaction date"
            />
            {errors.date && <p className="text-destructive text-sm">Please select a date</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Office supplies, Client payment"
              className={cn(
                "h-12 transition-all duration-200",
                errors.description && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.description && <p className="text-destructive text-sm">Please enter a description</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(
                "h-12 transition-all duration-200",
                errors.amount && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.amount && <p className="text-destructive text-sm">Please enter a valid amount</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as TransactionType)}
            >
              <SelectTrigger className="h-12 transition-all duration-200">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="text-income font-medium">Income</SelectItem>
                <SelectItem value="expense" className="text-expense font-medium">Expense</SelectItem>
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
              Cancel
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
