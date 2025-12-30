import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { markBillAsPaid } from './billSlice';
import { Bill, PaymentMethod, ExpenseCategory } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';
import {
  PAYMENT_METHOD_LABELS,
  CATEGORY_LABELS,
  FIXED_EXPENSE_CATEGORIES,
  VARIABLE_EXPENSE_CATEGORIES,
} from '../../constants/categories';

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onSuccess?: () => void;
}

export const PayBillModal: React.FC<PayBillModalProps> = ({
  isOpen,
  onClose,
  bill,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.bill);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    paymentMethod: 'debit' as PaymentMethod,
    category: 'rent' as ExpenseCategory,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when bill changes
  useEffect(() => {
    if (bill) {
      // Try to auto-detect category based on bill name
      const billNameLower = bill.name.toLowerCase();
      let suggestedCategory: ExpenseCategory = 'others';

      if (billNameLower.includes('rent')) suggestedCategory = 'rent';
      else if (billNameLower.includes('credit card') || billNameLower.includes('cc')) suggestedCategory = 'credit_card';
      else if (billNameLower.includes('electric') || billNameLower.includes('water') || billNameLower.includes('utility')) suggestedCategory = 'utilities';
      else if (billNameLower.includes('wifi') || billNameLower.includes('internet')) suggestedCategory = 'wifi';
      else if (billNameLower.includes('loan')) suggestedCategory = 'car_loan';

      setFormData({
        paymentMethod: 'debit',
        category: suggestedCategory,
      });
    }
    setErrors({});
  }, [bill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bill) return;

    if (!formData.paymentMethod) {
      setErrors({ paymentMethod: 'Payment method is required' });
      return;
    }

    if (!formData.category) {
      setErrors({ category: 'Category is required' });
      return;
    }

    try {
      await dispatch(
        markBillAsPaid({
          id: bill.id,
          paymentMethod: formData.paymentMethod,
          category: formData.category,
          addedBy: currentUser?.role || 'husband',
        })
      ).unwrap();

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to mark bill as paid' });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!bill) return null;

  // Prepare category options
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
      title="Mark Bill as Paid"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Details */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Bill Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Bill Name:</span>
              <span className="text-sm font-medium text-gray-900">{bill.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(bill.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Due Date:</span>
              <span className="text-sm text-gray-900">{formatDate(bill.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Payment Information</h4>

          {/* Payment Method */}
          <Select
            label="How did you pay?"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
            options={paymentMethodOptions}
            error={errors.paymentMethod}
            disabled={loading}
            required
          />

          {/* Category */}
          <Select
            label="Expense Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
            options={categoryOptions}
            error={errors.category}
            disabled={loading}
            required
          />

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              This will create an expense record and update your balance accordingly.
            </p>
          </div>
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
            variant="success"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};