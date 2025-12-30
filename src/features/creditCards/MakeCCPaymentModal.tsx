import React, { useState, useEffect } from 'react';
import { X, CreditCard as CreditCardIcon, AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppSelector } from '../../app/hooks';
import { CreditCard, UserRole } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface MakeCCPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
  onSubmit: (data: {
    amount: number;
    paidBy: UserRole;
    paymentDate: string;
    notes?: string;
  }) => Promise<void>;
}

export const MakeCCPaymentModal: React.FC<MakeCCPaymentModalProps> = ({
  isOpen,
  onClose,
  card,
  onSubmit,
}) => {
  const { balances } = useAppSelector((state) => state.balance);
  
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<UserRole>('husband');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (card && isOpen) {
      // Reset form
      setAmount('');
      setPaidBy(card.user || 'husband');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setError('');
    }
  }, [card, isOpen]);

  const selectedBalance = balances.find((b) => b.user === paidBy);
  const bankBalance = selectedBalance?.bank || 0;

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    // Validation
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!card) {
      setError('Credit card not found');
      return;
    }

    if (amountNum > card.outstandingBalance) {
      setError(`Payment amount cannot exceed outstanding balance (${formatCurrency(card.outstandingBalance)})`);
      return;
    }

    if (amountNum > bankBalance) {
      setError(`Insufficient bank balance (${formatCurrency(bankBalance)})`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        amount: amountNum,
        paidBy,
        paymentDate,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to make payment');
    } finally {
      setLoading(false);
    }
  };

  if (!card) return null;

  const amountNum = parseFloat(amount) || 0;
  const newOutstanding = card.outstandingBalance - amountNum;
  const newBankBalance = bankBalance - amountNum;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              <h4 className="font-semibold">{card.name}</h4>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="opacity-90">Outstanding Balance:</span>
              <span className="font-bold">{formatCurrency(card.outstandingBalance)}</span>
            </div>
            {card.minimumPayment > 0 && (
              <div className="flex justify-between">
                <span className="opacity-90">Minimum Payment:</span>
                <span className="font-medium">{formatCurrency(card.minimumPayment)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Amount <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            {card.minimumPayment > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAmount(card.minimumPayment)}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Min ({formatCurrency(card.minimumPayment)})
              </button>
            )}
            {card.statementBalance > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAmount(card.statementBalance)}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                Statement ({formatCurrency(card.statementBalance)})
              </button>
            )}
            <button
              type="button"
              onClick={() => handleQuickAmount(card.outstandingBalance)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Full ({formatCurrency(card.outstandingBalance)})
            </button>
          </div>
        </div>

        {/* Paid By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paid By <span className="text-red-500">*</span>
          </label>
          <Select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value as UserRole)}
            options={[
              { value: 'husband', label: 'Husband' },
              { value: 'wife', label: 'Wife' },
            ]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Bank balance: {formatCurrency(bankBalance)}
          </p>
        </div>

        {/* Payment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this payment..."
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Preview */}
        {amountNum > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">After Payment:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">New Outstanding:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(newOutstanding)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Bank Balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(newBankBalance)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning if insufficient balance */}
        {amountNum > bankBalance && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Insufficient bank balance</p>
              <p className="text-xs text-yellow-700 mt-1">
                You need {formatCurrency(amountNum - bankBalance)} more in your bank account
              </p>
            </div>
          </div>
        )}

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
          <Button type="submit" disabled={loading || amountNum > bankBalance}>
            {loading ? 'Processing...' : 'Make Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};