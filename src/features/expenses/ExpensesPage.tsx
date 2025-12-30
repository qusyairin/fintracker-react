import React, { useEffect, useState } from 'react';
import { Plus, TrendingDown, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchExpenses, deleteExpense } from './expenseSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { fetchCreditCards } from '../creditCards/creditCardSlice';
import { ExpenseList } from './ExpenseList';
import { AddExpenseModal } from './AddExpenseModal';
import { Expense } from '../../types';
import {
  formatCurrency,
  getCurrentMonth,
  getFinancialMonthName,
  formatFinancialMonthRange,
  getFinancialMonthRange,
} from '../../utils/dateUtils';

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector((state) => state.expense);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const { start: monthStart, end: monthEnd } = getFinancialMonthRange(selectedMonth);
  const monthName = getFinancialMonthName(selectedMonth);
  const monthRangeText = formatFinancialMonthRange(selectedMonth);

  // Calculate totals for selected month
  const monthExpenses = expenses.filter((exp) => exp.date >= monthStart && exp.date <= monthEnd);
  const totalExpenses = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = monthExpenses.filter((e) => e.status === 'pending').length;

  useEffect(() => {
    dispatch(fetchExpenses(selectedMonth));
  }, [dispatch, selectedMonth]);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setShowModal(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await dispatch(deleteExpense(id)).unwrap();
        await dispatch(fetchBalances());
        await dispatch(fetchCreditCards());
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const handleModalSuccess = () => {
    dispatch(fetchExpenses(selectedMonth));
    dispatch(fetchBalances());
    dispatch(fetchCreditCards());
  };

  // Generate month options (last 12 months)
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = getFinancialMonthName(yearMonth);
      options.push({ value: yearMonth, label });
    }
    
    return options;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your spending</p>
        </div>
        <Button onClick={handleAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters & Summary */}
      <Card>
        <div className="space-y-4">
          {/* Month Selector */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Period: {monthRangeText}</span>
            </div>
            <div className="w-full sm:w-64">
              <Select
                options={generateMonthOptions()}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Total Expenses */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">
                  Total Expenses ({monthName})
                </span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900">{monthExpenses.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Expense List */}
      <Card title="All Expenses">
        <ExpenseList
          expenses={monthExpenses}
          loading={loading}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </Card>

      {/* Expense Modal */}
      <AddExpenseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(undefined);
        }}
        expense={editingExpense}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};