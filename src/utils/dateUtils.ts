// ============================================
// FINANCIAL MONTH FUNCTIONS (25th to 24th)
// ============================================

// Get current financial month (25th to 24th cycle)
export const getCurrentFinancialMonth = (): string => {
  const today = new Date();
  const day = today.getDate();
  
  // If before 25th, we're in previous month's cycle
  if (day < 25) {
    today.setMonth(today.getMonth() - 1);
  }
  
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  return `${year}-${month}`;
};

// Get date range for a financial month (25th to 24th)
export const getFinancialMonthRange = (yearMonth: string): { start: string; end: string } => {
  const [year, month] = yearMonth.split('-').map(Number);
  
  // Start: 25th of the month
  const startDate = new Date(year, month - 1, 25);
  const start = startDate.toISOString().split('T')[0];
  
  // End: 24th of next month
  const endDate = new Date(year, month, 24);
  const end = endDate.toISOString().split('T')[0];
  
  return { start, end };
};

// Format financial month range for display (e.g., "Dec 25, 2024 - Jan 24, 2025")
export const formatFinancialMonthRange = (yearMonth: string): string => {
  const { start, end } = getFinancialMonthRange(yearMonth);
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Get financial month name (e.g., "December 2024")
export const getFinancialMonthName = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${year}`;
};

// Check if a date falls within a financial month
export const isInFinancialMonth = (date: string, yearMonth: string): boolean => {
  const { start, end } = getFinancialMonthRange(yearMonth);
  return date >= start && date <= end;
};

// ============================================
// EXISTING FUNCTIONS (Updated)
// ============================================

// Get current month - now uses financial month (25th-24th cycle)
export const getCurrentMonth = (): string => {
  return getCurrentFinancialMonth();
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return `RM${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-MY', { year: 'numeric', month: 'long' });
};

export const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getDaysUntilDate = (dateString: string): number => {
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInCurrentMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};