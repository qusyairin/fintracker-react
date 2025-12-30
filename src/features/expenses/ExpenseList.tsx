import React from 'react';
import { Pencil, Trash2, ShoppingBag } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Expense } from '../../types';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import { CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '../../constants/categories';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, loading, onEdit, onDelete }) => {
  const getUserColor = (user: string) => {
    return user === 'husband' ? 'text-blue-600' : 'text-pink-600';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No expenses recorded for this period</p>
        <p className="text-sm text-gray-500 mt-1">Start by adding your first expense</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Added By</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-900">{formatDate(expense.date)}</td>
              <td className="py-3 px-4 text-sm text-gray-900">
                <div className="flex flex-col">
                  <span>{expense.description}</span>
                  {expense.notes && (
                    <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {expense.notes}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {CATEGORY_LABELS[expense.category]}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
              </td>
              <td className="py-3 px-4">
                <span className={`text-sm font-medium ${getUserColor(expense.addedBy)}`}>
                  {expense.addedBy === 'husband' ? 'Husband' : 'Wife'}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </td>
              <td className="py-3 px-4 text-center">
                <Badge
                  variant={
                    expense.status === 'approved'
                      ? 'success'
                      : expense.status === 'pending'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {expense.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(expense)} // ← Changed: Pass entire expense object
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};