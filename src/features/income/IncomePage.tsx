import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchIncomes, deleteIncome } from './incomeSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { IncomeModal } from './IncomeModal';
import { Income } from '../../types';
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getFinancialMonthName,
  formatFinancialMonthRange,
  getFinancialMonthRange,
} from '../../utils/dateUtils';

export const IncomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { incomes, loading } = useAppSelector((state) => state.income);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { start: monthStart, end: monthEnd } = getFinancialMonthRange(selectedMonth);
  const monthName = getFinancialMonthName(selectedMonth);
  const monthRangeText = formatFinancialMonthRange(selectedMonth);

  // Calculate total income for selected month
  const totalIncome = incomes
    .filter((inc) => inc.date >= monthStart && inc.date <= monthEnd)
    .reduce((sum, inc) => sum + inc.amount, 0);

  useEffect(() => {
    dispatch(fetchIncomes(selectedMonth));
  }, [dispatch, selectedMonth]);

  const handleAddIncome = () => {
    setEditingIncome(undefined);
    setShowModal(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setShowModal(true);
  };

  const handleDeleteIncome = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await dispatch(deleteIncome(id)).unwrap();
        await dispatch(fetchBalances()); // Refresh balances
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete income:', error);
      }
    } else {
      setDeleteConfirm(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalSuccess = () => {
    dispatch(fetchIncomes(selectedMonth));
    dispatch(fetchBalances());
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

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      salary: 'Salary',
      bonus: 'Bonus',
      reimbursement: 'Reimbursement',
      other: 'Other',
    };
    return labels[source] || source;
  };

  const getUserColor = (user: string) => {
    return user === 'husband' ? 'text-blue-600' : 'text-pink-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600 mt-1">Track all income sources</p>
        </div>
        <Button onClick={handleAddIncome}>
          <Plus className="w-4 h-4 mr-2" />
          Add Income
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

          {/* Total Income */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Total Income ({monthName})
                </span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Income List */}
      <Card title="Income Records">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading incomes...
          </div>
        ) : incomes.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No income records for this period</p>
            <Button onClick={handleAddIncome} className="mt-4" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Income
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Source
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Notes
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr
                    key={income.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(income.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getSourceLabel(income.source)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getUserColor(income.user)}`}>
                        {income.user === 'husband' ? 'Husband' : 'Wife'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(income.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {income.notes ? (
                        <span className="line-clamp-1">{income.notes}</span>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditIncome(income)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIncome(income.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            deleteConfirm === income.id
                              ? 'bg-red-100 text-red-700'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteConfirm === income.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Income Modal */}
      <IncomeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingIncome(undefined);
        }}
        income={editingIncome}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};