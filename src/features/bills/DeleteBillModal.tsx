import React from 'react';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { Bill } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onConfirm: (billId: string) => Promise<void>;
}

export const DeleteBillModal: React.FC<DeleteBillModalProps> = ({
  isOpen,
  onClose,
  bill,
  onConfirm,
}) => {
  const handleConfirm = async (bill: Bill) => {
    await onConfirm(bill.id);
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      item={bill}
      title="Delete Bill"
      itemName="bill"
      fields={(bill) => [
        { label: 'Name', value: bill.name },
        { label: 'Amount', value: formatCurrency(bill.amount), className: 'text-sm font-bold text-red-600' },
        { label: 'Due Date', value: formatDate(bill.dueDate) },
        { 
          label: 'Status', 
          value: bill.isPaid ? 'Paid' : 'Unpaid',
          className: `text-sm font-medium ${bill.isPaid ? 'text-green-600' : 'text-orange-600'}`
        },
      ]}
      additionalWarning={(bill) =>
        bill.isPaid ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Deleting a paid bill will remove the associated expense and
              revert balance changes.
            </p>
          </div>
        ) : null
      }
      onConfirm={handleConfirm}
    />
  );
};