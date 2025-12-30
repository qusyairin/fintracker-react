import React from 'react';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { Income } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: Income | null;
  onConfirm: (incomeId: string) => Promise<void>;
}

export const DeleteIncomeModal: React.FC<DeleteIncomeModalProps> = ({
  isOpen,
  onClose,
  income,
  onConfirm,
}) => {
  const handleConfirm = async (income: Income) => {
    await onConfirm(income.id);
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      item={income}
      title="Delete Income"
      itemName="income"
      fields={(income) => [
        { label: 'Source', value: income.source },
        { label: 'Amount', value: formatCurrency(income.amount), className: 'text-sm font-bold text-green-600' },
        { label: 'Date', value: formatDate(income.date) },
        { label: 'User', value: income.user === 'husband' ? 'Husband' : 'Wife' },
        { 
          label: 'Status', 
          value: income.status === 'approved' ? 'Approved' : 'Pending',
          className: `text-sm font-medium ${income.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`
        },
      ]}
      additionalWarning={(income) =>
        income.status === 'approved' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Deleting an approved income will revert the balance changes.
            </p>
          </div>
        ) : null
      }
      onConfirm={handleConfirm}
    />
  );
};