import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Installment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  installment: Installment | null;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteInstallmentModal: React.FC<DeleteInstallmentModalProps> = ({
  isOpen,
  onClose,
  installment,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!installment) return;

    setLoading(true);
    setError('');

    try {
      await onConfirm(installment.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete installment');
    } finally {
      setLoading(false);
    }
  };

  if (!installment) return null;

  const progress = (installment.paidInstallments / installment.totalInstallments) * 100;
  const remaining = installment.totalInstallments - installment.paidInstallments;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Installment">
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">
              Are you sure you want to delete this installment?
            </h3>
            <p className="text-sm text-red-700 mt-1">
              This action cannot be undone. The installment record will be permanently removed.
            </p>
          </div>
        </div>

        {/* Installment Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Item Name</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{installment.itemName}</p>
          </div>

          {installment.description && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Description</p>
              <p className="text-sm text-gray-700 mt-1">{installment.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Monthly Payment</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatCurrency(installment.monthlyInstallment)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total Amount</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatCurrency(installment.totalAmount)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Progress</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {installment.paidInstallments} / {installment.totalInstallments} paid ({progress.toFixed(0)}%)
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Remaining</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {remaining} months
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Credit Card</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {installment.cardType.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Start Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatDate(installment.startDate)}
              </p>
            </div>
          </div>

          {installment.interestRate > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Interest Rate</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {installment.interestRate}%
              </p>
            </div>
          )}
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
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Deleting...' : 'Delete Installment'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};