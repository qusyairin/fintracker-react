import React, { useState, useEffect } from 'react';
import { PiggyBank, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Tabung } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface SaveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabung: Tabung | null;
  bankBalance: number;
  onSubmit: (id: string, amount: number, reason?: string) => Promise<void>;
}

export const SaveMoneyModal: React.FC<SaveMoneyModalProps> = ({
  isOpen,
  onClose,
  tabung,
  bankBalance,
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
    } else if (parseFloat(amount) > bankBalance) {
      newErrors.amount = 'Insufficient bank balance';
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
      setErrors({ submit: error.message || 'Failed to save money' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!tabung) return null;

  const savedAmount = tabung.savedAmount;
  const targetAmount = tabung.targetAmount;
  const remaining = Math.max(targetAmount - savedAmount, 0);
  const newTotal = savedAmount + parseFloat(amount || '0');
  const willExceedTarget = newTotal > targetAmount;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Save Money" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tabung Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">{tabung.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-blue-700">Current Saved</p>
              <p className="font-bold text-blue-900">{formatCurrency(savedAmount)}</p>
            </div>
            <div>
              <p className="text-blue-700">Target</p>
              <p className="font-bold text-blue-900">{formatCurrency(targetAmount)}</p>
            </div>
            <div>
              <p className="text-blue-700">Remaining</p>
              <p className="font-bold text-blue-900">{formatCurrency(remaining)}</p>
            </div>
            <div>
              <p className="text-blue-700">Bank Balance</p>
              <p className="font-bold text-blue-900">{formatCurrency(bankBalance)}</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <Input
          type="number"
          label="Amount to Save (RM)"
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

        {/* Will Exceed Warning */}
        {willExceedTarget && amount && parseFloat(amount) > 0 && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Exceeding target</p>
              <p className="text-xs mt-1">
                New total: {formatCurrency(newTotal)} (Target: {formatCurrency(targetAmount)})
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && !errors.amount && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">After saving:</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">New Saved Amount</span>
              <span className="font-bold text-gray-900">{formatCurrency(newTotal)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-700">New Bank Balance</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(bankBalance - parseFloat(amount))}
              </span>
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
            placeholder="e.g., Monthly savings, bonus allocation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
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
                Saving...
              </>
            ) : (
              <>
                <PiggyBank className="w-4 h-4 mr-2" />
                Save Money
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};