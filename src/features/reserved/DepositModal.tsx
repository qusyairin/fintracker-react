import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { depositBack } from './reservedSlice';
import { Reserved } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Reserved | null;
  onSuccess?: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.reserved);

  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      // Default to full amount
      setAmount(item.amount.toString());
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (item && parseFloat(amount) > item.amount) {
      newErrors.amount = 'Amount cannot exceed reserved amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !item) return;

    try {
      await dispatch(
        depositBack({
          id: item.id,
          amount: parseFloat(amount),
        })
      ).unwrap();

      onSuccess?.();
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to deposit back' });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleFullAmount = () => {
    if (item) {
      setAmount(item.amount.toString());
    }
  };

  if (!item) return null;

  const depositAmount = parseFloat(amount) || 0;
  const remainingAmount = item.amount - depositAmount;
  const isFullDeposit = depositAmount === item.amount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Deposit Back to Bank"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Reserved Item</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Purpose:</span>
              <span className="text-sm font-medium text-gray-900">{item.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Reserved Amount:</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</span>
            </div>
          </div>
        </div>

        {/* Amount to Deposit */}
        <div>
          <Input
            type="number"
            label="Amount to Deposit (RM)"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            disabled={loading}
            step="0.01"
            min="0"
            max={item.amount}
            required
          />
          <button
            type="button"
            onClick={handleFullAmount}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Use full amount
          </button>
        </div>

        {/* Preview */}
        {depositAmount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Amount to deposit:</span>
              <span className="font-semibold text-blue-900">{formatCurrency(depositAmount)}</span>
            </div>
            {!isFullDeposit && (
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Remaining reserved:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(remainingAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                {isFullDeposit
                  ? '✓ This will return all reserved money to your bank and delete this item.'
                  : '✓ This will return part of your reserved money to your bank.'}
              </p>
            </div>
          </div>
        )}

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
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? 'Processing...' : 'Deposit to Bank'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};