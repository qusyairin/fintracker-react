import React from 'react';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onConfirm: (expenseId: string) => Promise<void>;
}

export const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onConfirm,
}) => {
  const handleConfirm = async (expense: Expense) => {
    await onConfirm(expense.id);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash',
      debit: 'Debit Card',
      cc1: 'Credit Card 1',
      cc2: 'Credit Card 2',
      cc3: 'Credit Card 3',
    };
    return labels[method] || method;
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      item={expense}
      title="Delete Expense"
      itemName="expense"
      fields={(expense) => [
        { label: 'Description', value: expense.description },
        { label: 'Amount', value: formatCurrency(expense.amount), className: 'text-sm font-bold text-red-600' },
        { label: 'Category', value: expense.category },
        { label: 'Payment Method', value: getPaymentMethodLabel(expense.paymentMethod) },
        { label: 'Date', value: formatDate(expense.date) },
        { 
          label: 'Status', 
          value: expense.status === 'approved' ? 'Approved' : 'Pending',
          className: `text-sm font-medium ${expense.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`
        },
      ]}
      additionalWarning={(expense) =>
        expense.status === 'approved' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Deleting an approved expense will revert balance and credit card changes.
            </p>
          </div>
        ) : null
      }
      onConfirm={handleConfirm}
    />
  );
};