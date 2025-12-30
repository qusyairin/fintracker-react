import React from 'react';
import { DeleteConfirmationModal } from '../../components/common/DeleteConfirmationModal';
import { Tabung } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface DeleteTabungModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabung: Tabung | null;
  onConfirm: (tabungId: string) => Promise<void>;
}

export const DeleteTabungModal: React.FC<DeleteTabungModalProps> = ({
  isOpen,
  onClose,
  tabung,
  onConfirm,
}) => {
  const handleConfirm = async (tabung: Tabung) => {
    await onConfirm(tabung.id);
  };

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      item={tabung}
      title="Delete Tabung"
      itemName="tabung"
      fields={(tabung) => [
        { label: 'Name', value: tabung.name },
        { label: 'Saved Amount', value: formatCurrency(tabung.savedAmount), className: 'text-sm font-bold text-green-600' },
        { label: 'Target Amount', value: formatCurrency(tabung.targetAmount) },
        { label: 'Progress', value: `${tabung.progressPercentage || 0}%` },
        { label: 'Created', value: formatDate(tabung.startDate) },
        { label: 'User', value: tabung.user === 'husband' ? 'Husband' : 'Wife' },
      ]}
      additionalWarning={(tabung) =>
        tabung.savedAmount > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              <strong>Note:</strong> The saved amount of {formatCurrency(tabung.savedAmount)} will be
              returned to your bank balance.
            </p>
          </div>
        ) : null
      }
      onConfirm={handleConfirm}
    />
  );
};