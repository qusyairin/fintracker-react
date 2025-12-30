import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createIncome, updateIncome } from './incomeSlice';
import { Income, IncomeSource, UserRole } from '../../types';
import { getTodayString } from '../../utils/dateUtils';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income; // For editing
  onSuccess?: () => void;
}

const sourceOptions = [
  { value: 'salary', label: 'Salary' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'reimbursement', label: 'Reimbursement' },
  { value: 'other', label: 'Other' },
];

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  income,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.income);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Form state
  const [formData, setFormData] = useState({
    date: getTodayString(),
    amount: '',
    source: 'salary' as IncomeSource,
    user: 'husband' as UserRole,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing
  useEffect(() => {
    if (income) {
      setFormData({
        date: income.date,
        amount: income.amount.toString(),
        source: income.source,
        user: income.user,
        notes: income.notes || '',
      });
    } else {
      // Reset form for new income
      setFormData({
        date: getTodayString(),
        amount: '',
        source: 'salary',
        user: currentUser?.role || 'husband',
        notes: '',
      });
    }
    setErrors({});
  }, [income, isOpen, currentUser]);

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

    if (!formData.source) {
      newErrors.source = 'Source is required';
    }

    if (!formData.user) {
      newErrors.user = 'User is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const incomeData = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      source: formData.source,
      user: formData.user,
      notes: formData.notes.trim() || undefined,
      addedBy: currentUser?.role || 'husband',
    };

    try {
      if (income) {
        // Edit mode
        await dispatch(updateIncome({ id: income.id, data: incomeData })).unwrap();
      } else {
        // Add mode
        await dispatch(createIncome(incomeData)).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save income' });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={income ? 'Edit Income' : 'Add Income'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          disabled={loading}
          required
        />

        {/* Amount */}
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

        {/* Source */}
        <Select
          label="Source"
          options={sourceOptions}
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value as IncomeSource })}
          error={errors.source}
          disabled={loading}
          required
        />

        {/* User Selection - Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who received this income?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="user"
                value="husband"
                checked={formData.user === 'husband'}
                onChange={(e) => setFormData({ ...formData, user: e.target.value as UserRole })}
                disabled={loading}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Husband</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="user"
                value="wife"
                checked={formData.user === 'wife'}
                onChange={(e) => setFormData({ ...formData, user: e.target.value as UserRole })}
                disabled={loading}
                className="w-4 h-4 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">Wife</span>
            </label>
          </div>
          {errors.user && (
            <p className="mt-1 text-sm text-red-600">{errors.user}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={loading}
            placeholder="Add any additional notes..."
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
            {loading ? 'Saving...' : income ? 'Update Income' : 'Add Income'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};