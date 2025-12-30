import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { CreditCard } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface UpdateStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
  onSubmit: (data: {
    statementBalance: number;
    minimumPayment: number;
    statementDueDate: string;
  }) => Promise<void>;
}

export const UpdateStatementModal: React.FC<UpdateStatementModalProps> = ({
  isOpen,
  onClose,
  card,
  onSubmit,
}) => {
  const [statementBalance, setStatementBalance] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [statementDueDate, setStatementDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (card && isOpen) {
      // Pre-fill with existing values or defaults
      setStatementBalance(card.statementBalance?.toString() || '');
      setMinimumPayment(card.minimumPayment?.toString() || '');
      setStatementDueDate(card.statementDueDate || '');
      setError('');
    }
  }, [card, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const balanceNum = parseFloat(statementBalance);
    const minPaymentNum = parseFloat(minimumPayment);

    // Validation
    if (!statementBalance || isNaN(balanceNum) || balanceNum < 0) {
      setError('Please enter a valid statement balance');
      return;
    }

    if (!minimumPayment || isNaN(minPaymentNum) || minPaymentNum < 0) {
      setError('Please enter a valid minimum payment');
      return;
    }

    if (!statementDueDate) {
      setError('Please select a due date');
      return;
    }

    if (minPaymentNum > balanceNum) {
      setError('Minimum payment cannot exceed statement balance');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        statementBalance: balanceNum,
        minimumPayment: minPaymentNum,
        statementDueDate,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update statement');
    } finally {
      setLoading(false);
    }
  };

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Statement">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Enter your monthly statement details</p>
            <p className="text-xs text-blue-600 mt-1">
              This information comes from your credit card statement from the bank
            </p>
          </div>
        </div>

        {/* Current Info */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <h4 className="text-sm font-semibold text-gray-900">{card.name}</h4>
          <div className="text-xs text-gray-600 space-y-0.5">
            <p>Current Outstanding: {formatCurrency(card.outstandingBalance)}</p>
            <p>Available Limit: {formatCurrency(card.availableLimit || 0)}</p>
          </div>
        </div>

        {/* Statement Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statement Balance <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={statementBalance}
            onChange={(e) => setStatementBalance(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Total amount shown on your statement
          </p>
        </div>

        {/* Minimum Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Payment <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum payment required by the bank
          </p>
        </div>

        {/* Statement Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Due Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={statementDueDate}
            onChange={(e) => setStatementDueDate(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            When you must pay by to avoid late fees
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Statement'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};