import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Tabung } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface WithdrawMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabung: Tabung | null;
  onSubmit: (id: string, amount: number, reason?: string) => Promise<void>;
}

export const WithdrawMoneyModal: React.FC<WithdrawMoneyModalProps> = ({
  isOpen,
  onClose,
  tabung,
  onSubmit,
}) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setReason('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (tabung && parseFloat(amount) > tabung.savedAmount) {
      newErrors.amount = 'Insufficient saved amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tabung || !validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit(tabung.id, parseFloat(amount), reason.trim() || undefined);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to withdraw money' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleQuickAmount = (percentage: number) => {
    if (tabung) {
      const quickAmount = (tabung.savedAmount * percentage / 100).toFixed(2);
      setAmount(quickAmount);
    }
  };

  if (!tabung) return null;

  const savedAmount = tabung.savedAmount;
  const newAmount = Math.max(savedAmount - parseFloat(amount || '0'), 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Withdraw Money" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tabung Info */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3">{tabung.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-700">Available to Withdraw</span>
            <span className="text-2xl font-bold text-green-900">{formatCurrency(savedAmount)}</span>
          </div>
        </div>

        {/* Amount */}
        <Input
          type="number"
          label="Amount to Withdraw (RM)"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          disabled={isSubmitting}
          step="0.01"
          min="0"
          autoFocus
          required
        />

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Amount</label>
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                key={percentage}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAmount(percentage)}
                disabled={isSubmitting}
              >
                {percentage}%
              </Button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && !errors.amount && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">After withdrawal:</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Remaining in Tabung</span>
              <span className="font-bold text-gray-900">{formatCurrency(newAmount)}</span>
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Emergency expense, planned purchase"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none"
            rows={2}
            maxLength={500}
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
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Withdrawing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Withdraw
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};