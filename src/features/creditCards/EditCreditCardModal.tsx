import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { CreditCard } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface EditCreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard | null;
  onSubmit: (data: {
    name?: string;
    bank?: string;
    creditLimit?: number;
  }) => Promise<void>;
}

export const EditCreditCardModal: React.FC<EditCreditCardModalProps> = ({
  isOpen,
  onClose,
  card,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (card && isOpen) {
      setName(card.name);
      setBank(card.bank);
      setCreditLimit(card.creditLimit.toString());
      setError('');
    }
  }, [card, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const limitNum = parseFloat(creditLimit);

    // Validation
    if (!name.trim()) {
      setError('Card name is required');
      return;
    }

    if (!bank.trim()) {
      setError('Bank name is required');
      return;
    }

    if (!creditLimit || isNaN(limitNum) || limitNum <= 0) {
      setError('Please enter a valid credit limit');
      return;
    }

    if (card && limitNum < card.outstandingBalance) {
      setError(`Credit limit cannot be less than outstanding balance (${formatCurrency(card.outstandingBalance)})`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        bank: bank.trim(),
        creditLimit: limitNum,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update credit card');
    } finally {
      setLoading(false);
    }
  };

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Credit Card">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Maybank Shopee"
            maxLength={100}
            required
          />
        </div>

        {/* Bank */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="e.g., Maybank"
            maxLength={50}
            required
          />
        </div>

        {/* Credit Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credit Limit <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Current outstanding: {formatCurrency(card.outstandingBalance)}
          </p>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This only updates card details. To update statement balance or make payments, use the respective buttons on the card.
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};