import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createBill, updateBill } from './billSlice';
import { Bill, BillFrequency } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import { BILL_FREQUENCY_LABELS } from '../../constants/categories';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill?: Bill; // For editing
  onSuccess?: () => void;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  bill,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.bill);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: getTodayString(),
    recurring: false,
    frequency: 'monthly' as BillFrequency,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing
  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate,
        recurring: bill.recurring || false,
        frequency: bill.frequency || 'monthly',
      });
    } else {
      // Reset form for new bill
      setFormData({
        name: '',
        amount: '',
        dueDate: getTodayString(),
        recurring: false,
        frequency: 'monthly',
      });
    }
    setErrors({});
  }, [bill, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const billData = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      recurring: formData.recurring,
      frequency: formData.recurring ? formData.frequency : undefined,
      isPaid: bill?.isPaid || false,
    };

    try {
      if (bill) {
        // Edit mode
        await dispatch(updateBill({ id: bill.id, data: billData })).unwrap();
      } else {
        // Add mode
        await dispatch(createBill(billData)).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save bill' });
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
      title={bill ? 'Edit Bill' : 'Add New Bill'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Name */}
        <Input
          type="text"
          label="Bill Name"
          placeholder="e.g., Rent, Credit Card"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={loading}
          required
        />

        {/* Amount & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            step="0.01"
            label="Amount (RM)"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            disabled={loading}
            required
          />

          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            error={errors.dueDate}
            disabled={loading}
            required
          />
        </div>

        {/* Recurring Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="recurring"
            type="checkbox"
            checked={formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
            disabled={loading}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
            This is a recurring bill
          </label>
        </div>

        {/* Frequency (if recurring) */}
        {formData.recurring && (
          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value as BillFrequency })
            }
            options={Object.entries(BILL_FREQUENCY_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            disabled={loading}
          />
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : bill ? 'Update Bill' : 'Add Bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};