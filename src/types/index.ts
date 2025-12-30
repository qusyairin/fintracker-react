export type UserRole = 'husband' | 'wife';

export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export type PaymentMethod = 'cash' | 'cc1' | 'cc2' | 'cc3' | 'shopee_pay_later' | 'debit';

export type IncomeSource = 'salary' | 'bonus' | 'reimbursement' | 'other';

export type ExpenseCategory =
  | 'rent' | 'car_loan' | 'student_loan' | 'utilities' | 'prepaid' | 'wifi' | 'toll'
  | 'fuel' | 'shopee_pay_later' | 'credit_card' | 'savings' | 'family'
  | 'groceries' | 'dining_out' | 'food_delivery' | 'shopping' | 'entertainment'
  | 'transportation' | 'healthcare' | 'personal_care' | 'travel' | 'others';

export type BillFrequency = 'monthly' | 'quarterly' | 'yearly';

export type CreditCardType = 'cc1' | 'cc2' | 'cc3';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  salaryDate: number;
  salaryAmount: number;
}

export interface Income {
  id: string;
  date: string;
  amount: number;
  source: IncomeSource;
  user: UserRole;
  notes?: string;
  status: TransactionStatus;
  addedBy: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  description: string;
  addedBy: UserRole;
  receiptUrl?: string;
  notes?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  frequency?: BillFrequency;
  isPaid: boolean;
  paidDate?: string;
  expenseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  month: string;
  category: ExpenseCategory;
  plannedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard {
  id: string;
  name: string;
  type: CreditCardType;
  bank: string;
  creditLimit: number;
  outstandingBalance: number;
  statementDate: number;
  paymentDueDate: number;
  minimumPaymentPercent: number;
  interestRate: number;
  owner: UserRole;
}

export interface CreditCardTransaction {
  id: string;
  cardType: CreditCardType;
  date: string;
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  createdAt: string;
}

export interface CreditCardPayment {
  id: string;
  cardType: CreditCardType;
  date: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface Installment {
  id: string;
  cardType: CreditCardType;
  itemName: string;
  totalAmount: number;
  monthlyInstallment: number;
  totalInstallments: number;
  paidInstallments: number;
  interestRate: number;
  startDate: string;
}

export interface Balance {
  id?: string;
  user: UserRole;
  cash: number;
  bank: number;
  setAside: number;
  total: number;
  openingBalance: number;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  budgetUtilization: number;
}

export interface CategoryBudgetSummary {
  category: ExpenseCategory;
  budgeted: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  surplus: number;
}

export interface UserBalance extends Balance {
  user: UserRole;
  openingBalance: number;
}

export interface BalanceHistory {
  id: string;
  user: UserRole;
  changedBy: UserRole;
  field: 'cash' | 'bank' | 'setAside';
  oldValue: number;
  newValue: number;
  reason?: string;
  timestamp: string;
}

export interface Reserved {
  id: string;
  user: UserRole;
  purpose: string;
  amount: number;
  dateCreated: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tabung {
  id: string;
  user: UserRole;
  name: string;
  description?: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string; // ISO date string
  targetDate?: string; // ISO date string
  status: 'active' | 'completed';
  progressPercentage?: number;
  remainingAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TabungTransaction {
  id: string;
  tabungId: string;
  user: UserRole;
  type: 'save' | 'withdraw';
  amount: number;
  previousAmount: number;
  newAmount: number;
  reason?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}
