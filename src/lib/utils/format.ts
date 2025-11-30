import { format, formatDistance, formatRelative } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: id });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy, HH:mm', { locale: id });
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: id });
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(m2: number): string {
  if (m2 >= 10000) {
    return `${formatNumber(m2 / 10000, 2)} ha`;
  }
  return `${formatNumber(m2, 2)} m²`;
}

export function formatNIK(nik: string): string {
  // Format NIK: XXXX-XXXX-XXXX-XXXX
  return nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
}
