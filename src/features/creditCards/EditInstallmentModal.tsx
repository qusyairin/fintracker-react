import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Installment } from '../../types';

interface EditInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: Installment | null;
  onSubmit: (data: {
    itemName?: string;
    description?: string;
    monthlyInstallment?: number;
    totalInstallments?: number;
    interestRate?: number;
  }) => Promise<void>;
}

export const EditInstallmentModal: React.FC<EditInstallmentModalProps> = ({
  isOpen,
  onClose,
  installment,
  onSubmit,
}) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (installment && isOpen) {
      setItemName(installment.itemName);
      setDescription(installment.description || '');
      setMonthlyInstallment(installment.monthlyInstallment.toString());
      setTotalInstallments(installment.totalInstallments.toString());
      setInterestRate(installment.interestRate.toString());
      setError('');
    }
  }, [installment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const monthlyInstallmentNum = parseFloat(monthlyInstallment);
    const totalInstallmentsNum = parseInt(totalInstallments);
    const interestRateNum = parseFloat(interestRate) || 0;

    // Validation
    if (!itemName.trim()) {
      setError('Please enter an item name');
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

    if (installment && totalInstallmentsNum < installment.paidInstallments) {
      setError(`Total installments cannot be less than paid installments (${installment.paidInstallments})`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        itemName: itemName.trim(),
        description: description.trim() || undefined,
        monthlyInstallment: monthlyInstallmentNum,
        totalInstallments: totalInstallmentsNum,
        interestRate: interestRateNum,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update installment');
    } finally {
      setLoading(false);
    }
  };

  if (!installment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Installment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Changing installment details won't affect paid installments count.
          </p>
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
            onChange={(e) => setMonthlyInstallment(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* Total Installments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Installments <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={totalInstallments}
            onChange={(e) => setTotalInstallments(e.target.value)}
            placeholder="12"
            min={installment.paidInstallments}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Paid: {installment.paidInstallments} / {installment.totalInstallments}
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