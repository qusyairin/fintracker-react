import React from 'react';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { Reserved } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteReservedModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Reserved | null;
  onConfirm: (itemId: string) => Promise<void>;
}

export const DeleteReservedModal: React.FC<DeleteReservedModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirm,
}) => {
  const handleConfirm = async (item: Reserved) => {
    await onConfirm(item.id);
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Delete Reserved Item"
      itemName="reserved item"
      fields={(item) => [
        { label: 'Purpose', value: item.purpose },
        { label: 'Amount', value: formatCurrency(item.amount), className: 'text-sm font-bold text-blue-600' },
        { label: 'Date Created', value: formatDate(item.dateCreated) },
        ...(item.dueDate ? [{ label: 'Due Date', value: formatDate(item.dueDate) }] : []),
        { label: 'User', value: item.user === 'husband' ? 'Husband' : 'Wife' },
      ]}
      additionalWarning={() => (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Deleting this item will return the full amount to your bank balance.
          </p>
        </div>
      )}
      onConfirm={handleConfirm}
    />
  );
};