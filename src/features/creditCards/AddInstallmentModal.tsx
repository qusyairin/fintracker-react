import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useAppSelector } from '../../app/hooks';
import { UserRole } from '../../types';

interface AddInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    creditCardId: string;
    cardType: string;
    user: UserRole;
    itemName: string;
    description?: string;
    totalAmount: number;
    monthlyInstallment: number;
    totalInstallments: number;
    interestRate?: number;
    startDate: string;
  }) => Promise<void>;
}

export const AddInstallmentModal: React.FC<AddInstallmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { cards } = useAppSelector((state) => state.creditCard);

  const [creditCardId, setCreditCardId] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    setCreditCardId('');
    setItemName('');
    setDescription('');
    setTotalAmount('');
    setMonthlyInstallment('');
    setTotalInstallments('');
    setInterestRate('0');
    setStartDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const totalAmountNum = parseFloat(totalAmount);
    const monthlyInstallmentNum = parseFloat(monthlyInstallment);
    const totalInstallmentsNum = parseInt(totalInstallments);
    const interestRateNum = parseFloat(interestRate) || 0;

    // Validation
    if (!creditCardId) {
    setError('Please select a credit card');
    return;
    }

    if (!itemName.trim()) {
    setError('Please enter an item name');
    return;
    }

    if (!totalAmount || isNaN(totalAmountNum) || totalAmountNum <= 0) {
    setError('Please enter a valid total amount');
    return;
    }

    if (!monthlyInstallment || isNaN(monthlyInstallmentNum) || monthlyInstallmentNum <= 0) {
    setError('Please enter a valid monthly installment');
    return;
    }

    if (!totalInstallments || isNaN(totalInstallmentsNum) || totalInstallmentsNum < 1) {
    setError('Please enter a valid number of installments');
    return;
    }

    const calculatedTotal = monthlyInstallmentNum * totalInstallmentsNum;
    if (Math.abs(calculatedTotal - totalAmountNum) > 0.01) {
    setError(
        `Total amount (${totalAmountNum}) doesn't match monthly installment × total installments (${calculatedTotal})`
    );
    return;
    }

    const selectedCard = cards.find((c) => c.id === creditCardId);
    if (!selectedCard) {
    setError('Selected credit card not found');
    return;
    }

    // ← FIX: Ensure user field is present
    const userField = selectedCard.user || selectedCard.owner;
    if (!userField) {
    setError('Credit card user information is missing. Please contact support.');
    console.error('Credit card missing user field:', selectedCard);
    return;
    }

    setLoading(true);
    try {
    await onSubmit({
        creditCardId,
        cardType: selectedCard.type,
        user: userField, // ← Use the validated user field
        itemName: itemName.trim(),
        description: description.trim() || undefined,
        totalAmount: totalAmountNum,
        monthlyInstallment: monthlyInstallmentNum,
        totalInstallments: totalInstallmentsNum,
        interestRate: interestRateNum,
        startDate,
    });
    handleReset();
    onClose();
    } catch (err: any) {
    setError(err.message || 'Failed to create installment');
    } finally {
    setLoading(false);
    }
    };

  const handleMonthlyChange = (value: string) => {
    setMonthlyInstallment(value);
    const monthly = parseFloat(value);
    const total = parseInt(totalInstallments);
    if (!isNaN(monthly) && !isNaN(total) && total > 0) {
      setTotalAmount((monthly * total).toFixed(2));
    }
  };

  const handleTotalInstallmentsChange = (value: string) => {
    setTotalInstallments(value);
    const monthly = parseFloat(monthlyInstallment);
    const total = parseInt(value);
    if (!isNaN(monthly) && !isNaN(total) && total > 0) {
      setTotalAmount((monthly * total).toFixed(2));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Installment Plan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Track your credit card installment plans</p>
            <p className="text-xs text-blue-600 mt-1">
              This helps you monitor ongoing installment payments
            </p>
          </div>
        </div>

        {/* Credit Card Selection */}
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
            required
          />
        </div>

        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., iPhone 15 Pro"
            maxLength={100}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes about this installment..."
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Monthly Installment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Installment <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={monthlyInstallment}
            onChange={(e) => handleMonthlyChange(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Amount charged each month
          </p>
        </div>

        {/* Total Installments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Installments <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={totalInstallments}
            onChange={(e) => handleTotalInstallmentsChange(e.target.value)}
            placeholder="12"
            min="1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Total number of months
          </p>
        </div>

        {/* Total Amount (Auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Total price of the item (auto-calculated from monthly × months)
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%) (Optional)
          </label>
          <Input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Annual interest rate if applicable
          </p>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            When the installment plan started
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
            {loading ? 'Creating...' : 'Create Installment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};