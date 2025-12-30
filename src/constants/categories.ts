import { ExpenseCategory } from '../types';

export const FIXED_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'rent',
  'car_loan',
  'student_loan',
  'utilities',
  'prepaid',
  'wifi',
  'toll',
  'fuel',
  'shopee_pay_later',
  'credit_card',
  'savings',
  'family',
];

export const VARIABLE_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'groceries',
  'dining_out',
  'food_delivery',
  'shopping',
  'entertainment',
  'transportation',
  'healthcare',
  'personal_care',
  'travel',
  'others',
];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  rent: 'Rent',
  car_loan: 'Car Loan',
  student_loan: 'Student Loan',
  utilities: 'Electricity & Water',
  prepaid: 'Prepaid',
  wifi: 'WiFi',
  toll: 'Toll',
  fuel: 'Fuel',
  shopee_pay_later: 'Shopee Pay Later',
  credit_card: 'Credit Card',
  savings: 'Savings',
  family: 'Family',
  groceries: 'Groceries',
  dining_out: 'Dining Out',
  food_delivery: 'Food Delivery',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  transportation: 'Transportation',
  healthcare: 'Healthcare',
  personal_care: 'Personal Care',
  travel: 'Travel',
  others: 'Others',
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  cc1: 'Credit Card 1',
  cc2: 'Credit Card 2',
  cc3: 'Credit Card 3',
  shopee_pay_later: 'Shopee Pay Later',
  debit: 'Debit Card',
};

export const INCOME_SOURCE_LABELS = {
  salary: 'Salary',
  bonus: 'Bonus',
  reimbursement: 'Reimbursement',
  other: 'Other',
};

export const BILL_FREQUENCY_LABELS = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};
