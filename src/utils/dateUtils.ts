
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MM/dd/yyyy');
};

export const formatDateLong = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM do, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy h:mm a');
};

export const getRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isYesterday(dateObj)) return 'Yesterday';
  if (isThisWeek(dateObj)) return format(dateObj, 'EEEE');
  if (isThisMonth(dateObj)) return format(dateObj, 'MMMM do');
  if (isThisYear(dateObj)) return format(dateObj, 'MMMM do');
  
  return format(dateObj, 'MMM do, yyyy');
};

export const getMonthName = (month: number): string => {
  return format(new Date(2000, month, 1), 'MMMM');
};

export const getCurrentMonthAndYear = (): string => {
  return format(new Date(), 'MMMM yyyy');
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
