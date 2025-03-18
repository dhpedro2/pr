
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM, yyyy', { locale: ptBR });
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateLong = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm', { locale: ptBR });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd MMM, yyyy 'às' HH:mm", { locale: ptBR });
};

export const getRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) return 'Hoje';
  if (isYesterday(dateObj)) return 'Ontem';
  if (isThisWeek(dateObj)) return format(dateObj, 'EEEE', { locale: ptBR });
  if (isThisMonth(dateObj)) return format(dateObj, "dd 'de' MMMM", { locale: ptBR });
  if (isThisYear(dateObj)) return format(dateObj, "dd 'de' MMMM", { locale: ptBR });
  
  return format(dateObj, "dd 'de' MMM, yyyy", { locale: ptBR });
};

export const getMonthName = (month: number): string => {
  return format(new Date(2000, month, 1), 'MMMM', { locale: ptBR });
};

export const getCurrentMonthAndYear = (): string => {
  return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
};

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
