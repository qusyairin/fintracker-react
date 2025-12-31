import React, { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchExpenses,
  deleteExpense,
  approveExpense,
} from './expenseSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { fetchCreditCards } from '../creditCards/creditCardSlice';
import { ExpenseList } from './ExpenseList';
import { AddExpenseModal } from './AddExpenseModal';
import { DeleteExpenseModal } from './DeleteExpenseModal';
import { Expense } from '../../types';
import { formatCurrency, getCurrentMonth } from '../../utils/dateUtils';
import { CATEGORY_LABELS } from '../../constants/categories';

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector((state) => state.expense);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null); // ← Add this

  useEffect(() => {
    dispatch(fetchExpenses(selectedMonth));
    dispatch(fetchBalances());
    dispatch(fetchCreditCards());
  }, [dispatch, selectedMonth]);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setIsAddModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setDeletingExpense(expense);
  };

  const handleApproveExpense = async (expenseId: string) => {
    setApprovingId(expenseId); // ← Set loading state
    try {
      await dispatch(approveExpense(expenseId)).unwrap();
      await dispatch(fetchExpenses(selectedMonth));
      await dispatch(fetchBalances());
      await dispatch(fetchCreditCards());
    } catch (error) {
      console.error('Failed to approve expense:', error);
    } finally {
      setApprovingId(null); // ← Clear loading state
    }
  };

  const handleConfirmDelete = async (expenseId: string) => {
    await dispatch(deleteExpense(expenseId)).unwrap();
    await dispatch(fetchExpenses(selectedMonth));
    await dispatch(fetchBalances());
    await dispatch(fetchCreditCards());
  };

  const handleModalSuccess = async () => {
    await dispatch(fetchExpenses(selectedMonth));
    await dispatch(fetchBalances());
    await dispatch(fetchCreditCards());
  };

  // Filter expenses
  const approvedExpenses = expenses.filter((e) => e.status === 'approved');
  const pendingExpenses = expenses.filter((e) => e.status === 'pending');

  // Calculate stats
  const totalExpenses = approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Category breakdown
  const categoryBreakdown = approvedExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

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

      {/* Month Filter */}
      <Card>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <span className="text-sm text-gray-600">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{pendingExpenses.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Average per Day</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(approvedExpenses.length > 0 ? totalExpenses / 30 : 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card title="Top Spending Categories">
          <div className="space-y-3">
            {topCategories.map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{CATEGORY_LABELS[category]}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pending Expenses */}
      {pendingExpenses.length > 0 && (
        <Card title="Pending Approval">
          <ExpenseList
            expenses={pendingExpenses}
            loading={loading}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onApprove={handleApproveExpense}
            approvingId={approvingId} // ← Pass loading state
          />
        </Card>
      )}

      {/* All Expenses */}
      <Card title="All Expenses">
        <ExpenseList
          expenses={approvedExpenses}
          loading={loading}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          approvingId={approvingId} // ← Pass loading state
        />
      </Card>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExpense(undefined);
        }}
        expense={editingExpense}
        onSuccess={handleModalSuccess}
      />

      <DeleteExpenseModal
        isOpen={deletingExpense !== null}
        onClose={() => setDeletingExpense(null)}
        expense={deletingExpense}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};