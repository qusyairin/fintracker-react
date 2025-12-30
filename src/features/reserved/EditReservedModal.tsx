import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateReservedItem } from './reservedSlice';
import { Reserved } from '../../types';

interface EditReservedModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Reserved | null;
  onSuccess?: () => void;
}

export const EditReservedModal: React.FC<EditReservedModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.reserved);

  const [formData, setFormData] = useState({
    purpose: '',
    amount: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        purpose: item.purpose,
        amount: item.amount.toString(),
        dueDate: item.dueDate || '',
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (formData.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !item) return;

    try {
      await dispatch(
        updateReservedItem({
          id: item.id,
          data: {
            purpose: formData.purpose.trim(),
            amount: parseFloat(formData.amount),
            dueDate: formData.dueDate || undefined,
          },
        })
      ).unwrap();

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update reserved item' });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Reserved Money"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purpose */}
        <Input
          type="text"
          label="Purpose"
          placeholder="e.g., House Renovation, Emergency Fund"
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          error={errors.purpose}
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

        {/* Due Date (Optional) */}
        <Input
          type="date"
          label="Due Date (Optional)"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          error={errors.dueDate}
          disabled={loading}
        />

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            Changing the amount will adjust your bank balance accordingly.
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
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Reserved'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};