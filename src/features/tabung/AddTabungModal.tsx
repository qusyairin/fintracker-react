import React, { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { UserRole } from '../../types';

interface AddTabungModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRole;
  onSubmit: (data: {
    user: UserRole;
    name: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
  }) => Promise<void>;
}

export const AddTabungModal: React.FC<AddTabungModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        targetDate: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tabung name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (formData.targetDate) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.targetDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        user,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate || undefined,
      });
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create tabung' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Tabung" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <PiggyBank className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Create a savings goal</p>
            <p className="text-xs mt-1">
              Money saved will be deducted from your bank balance
            </p>
          </div>
        </div>

        {/* Name */}
        <Input
          type="text"
          label="Tabung Name"
          placeholder="e.g., Vacation Fund, Emergency Savings"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={isSubmitting}
          required
          maxLength={100}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isSubmitting}
            placeholder="What are you saving for?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Target Amount & Date */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Target Amount (RM)"
            placeholder="0.00"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            error={errors.targetAmount}
            disabled={isSubmitting}
            step="0.01"
            min="0"
            required
          />

          <Input
            type="date"
            label="Target Date (Optional)"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            error={errors.targetDate}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Tabung'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};