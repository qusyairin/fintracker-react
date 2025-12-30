import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface DeleteField {
  label: string;
  value: string | number;
  className?: string;
}

interface DeleteConfirmationModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  item: T | null;
  title?: string;
  itemName?: string;
  fields: (item: T) => DeleteField[];
  warningMessage?: string;
  additionalWarning?: (item: T) => React.ReactNode;
  onConfirm: (item: T) => Promise<void>;
}

export function DeleteConfirmationModal<T>({
  isOpen,
  onClose,
  item,
  title = 'Delete Item',
  itemName = 'item',
  fields,
  warningMessage,
  additionalWarning,
  onConfirm,
}: DeleteConfirmationModalProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!item) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm(item);
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to delete ${itemName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  if (!item) return null;

  const displayFields = fields(item);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {warningMessage || `Are you sure you want to delete this ${itemName}?`}
          </h3>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
        </div>

        {/* Item Details */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-2">
            {displayFields.map((field, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{field.label}:</span>
                <span className={field.className || 'text-sm font-semibold text-gray-900'}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Warning */}
        {additionalWarning && additionalWarning(item)}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              `Delete ${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}