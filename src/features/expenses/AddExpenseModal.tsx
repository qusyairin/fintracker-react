import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createExpense, updateExpense } from './expenseSlice';
import { Expense, ExpenseCategory, PaymentMethod, UserRole } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import {
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  FIXED_EXPENSE_CATEGORIES,
  VARIABLE_EXPENSE_CATEGORIES,
} from '../../constants/categories';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense; // For editing
  onSuccess?: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.expense);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    date: getTodayString(),
    amount: '',
    category: 'groceries' as ExpenseCategory,
    paymentMethod: 'debit' as PaymentMethod,
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        amount: expense.amount.toString(),
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        description: expense.description,
        notes: expense.notes || '',
      });
    } else {
      // Reset form for new expense
      setFormData({
        date: getTodayString(),
        amount: '',
        category: 'groceries',
        paymentMethod: 'debit',
        description: '',
        notes: '',
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.date > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const expenseData = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      description: formData.description.trim(),
      notes: formData.notes.trim() || undefined,
      addedBy: currentUser?.role || 'husband',
    };

    try {
      if (expense) {
        // Edit mode
        await dispatch(updateExpense({ id: expense.id, data: expenseData })).unwrap();
      } else {
        // Add mode
        await dispatch(createExpense(expenseData)).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save expense' });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Prepare category options with groups
  const allCategories = [...FIXED_EXPENSE_CATEGORIES, ...VARIABLE_EXPENSE_CATEGORIES];
  const categoryOptions = allCategories.map((cat) => ({
    value: cat,
    label: CATEGORY_LABELS[cat],
  }));

  const paymentMethodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={expense ? 'Edit Expense' : 'Add New Expense'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date & Amount */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
            disabled={loading}
            required
          />

          <Input
            type="number"
            label="Amount (RM)"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            disabled={loading}
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Category */}
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
          options={categoryOptions}
          error={errors.category}
          disabled={loading}
          required
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
          options={paymentMethodOptions}
          error={errors.paymentMethod}
          disabled={loading}
          required
        />

        {/* Description */}
        <Input
          type="text"
          label="Description"
          placeholder="What was this expense for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          disabled={loading}
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={loading}
            placeholder="Any additional notes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            rows={3}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.notes.length}/500 characters
          </p>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {expense ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              expense ? 'Update Expense' : 'Add Expense'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};