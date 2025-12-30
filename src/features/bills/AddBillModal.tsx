import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppSelector } from '../../app/hooks';
import { Bill, BillType, RegularBillType } from '../../types';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill?: Bill;
  onSuccess: () => void;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({
  isOpen,
  onClose,
  bill,
  onSuccess,
}) => {
  const { cards } = useAppSelector((state) => state.creditCard);

  const [type, setType] = useState<BillType>('bill');
  const [billType, setBillType] = useState<RegularBillType>('other');
  const [creditCardId, setCreditCardId] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (bill) {
        // Edit mode
        setType(bill.type);
        setBillType(bill.billType || 'other');
        setCreditCardId(bill.creditCardId || '');
        setName(bill.name);
        setAmount(bill.amount.toString());
        setDueDate(bill.dueDate);
        setRecurring(bill.recurring);
        setFrequency(bill.frequency || 'monthly');
      } else {
        // Add mode - reset
        setType('bill');
        setBillType('other');
        setCreditCardId('');
        setName('');
        setAmount('');
        setDueDate('');
        setRecurring(false);
        setFrequency('monthly');
      }
      setError('');
    }
  }, [isOpen, bill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    // Validation
    if (!name.trim()) {
      setError('Bill name is required');
      return;
    }

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    if (type === 'bill' && !billType) {
      setError('Please select a bill type');
      return;
    }

    if (type === 'credit_card_payment' && !creditCardId) {
      setError('Please select a credit card');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        type,
        name: name.trim(),
        amount: amountNum,
        dueDate,
        recurring,
      };

      if (type === 'bill') {
        data.billType = billType;
      } else {
        data.creditCardId = creditCardId;
      }

      if (recurring) {
        data.frequency = frequency;
      }

      const url = bill
        ? `${import.meta.env.VITE_API_URL}/bills/${bill.id}`
        : `${import.meta.env.VITE_API_URL}/bills`;

      const method = bill ? 'PUT' : 'POST';

      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save bill');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  const billTypeOptions = [
    { value: 'tnb', label: 'TNB (Electricity)' },
    { value: 'rent', label: 'Rent' },
    { value: 'water', label: 'Water' },
    { value: 'internet', label: 'Internet' },
    { value: 'phone', label: 'Phone' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bill ? 'Edit Bill' : 'Add Bill'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Type Selection */}
        {!bill && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as BillType)}
              options={[
                { value: 'bill', label: 'Regular Bill (TNB, Rent, etc)' },
                { value: 'credit_card_payment', label: 'Credit Card Payment' },
              ]}
            />
          </div>
        )}

        {/* Bill Type (for regular bills) */}
        {type === 'bill' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bill Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={billType}
              onChange={(e) => setBillType(e.target.value as RegularBillType)}
              options={billTypeOptions}
            />
          </div>
        )}

        {/* Credit Card Selection (for CC payments) */}
        {type === 'credit_card_payment' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Card <span className="text-red-500">*</span>
            </label>
            <Select
              value={creditCardId}
              onChange={(e) => setCreditCardId(e.target.value)}
              options={[
                { value: '', label: 'Select a credit card' },
                ...cards.map((card) => ({
                  value: card.id,
                  label: `${card.name} (${card.user === 'husband' ? 'Husband' : 'Wife'})`,
                })),
              ]}
            />
          </div>
        )}

        {/* Bill Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'credit_card_payment' ? 'Payment Name' : 'Bill Name'}{' '}
            <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              type === 'credit_card_payment'
                ? 'e.g., Maybank Shopee Payment'
                : 'e.g., TNB Bill'
            }
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* Recurring (only for regular bills) */}
        {type === 'bill' && (
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
                Recurring Bill
              </label>
            </div>

            {recurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <Select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value as 'monthly' | 'quarterly' | 'yearly')
                  }
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
              </div>
            )}
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : bill ? 'Save Changes' : 'Add Bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};