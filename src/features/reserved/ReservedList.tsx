import React from 'react';
import { Pencil, Trash2, ArrowDownToLine, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Reserved } from '../../types';
import { formatDate, formatCurrency, getDaysUntilDate } from '../../utils/dateUtils';

interface ReservedListProps {
  items: Reserved[];
  loading: boolean;
  onEdit: (item: Reserved) => void;
  onDelete: (item: Reserved) => void; // ← Changed from (itemId: string)
  onDeposit: (item: Reserved) => void;
}

export const ReservedList: React.FC<ReservedListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onDeposit,
}) => {
  const getDueDateStatus = (dueDate?: string): 'overdue' | 'due-soon' | 'normal' | null => {
    if (!dueDate) return null;
    
    const daysUntil = getDaysUntilDate(dueDate);
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 7) return 'due-soon';
    return 'normal';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading reserved items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowDownToLine className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600">No reserved items</p>
        <p className="text-sm text-gray-500 mt-1">Start by adding your first reserved money</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const dueDateStatus = getDueDateStatus(item.dueDate);

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              {/* Left: Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{item.purpose}</h4>
                  {dueDateStatus === 'overdue' && (
                    <Badge variant="danger" size="sm">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                  {dueDateStatus === 'due-soon' && (
                    <Badge variant="warning" size="sm">
                      Due Soon
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Created: {formatDate(item.dateCreated)}</span>
                  {item.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {formatDate(item.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Amount & Actions */}
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  {formatCurrency(item.amount)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onDeposit(item)}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Deposit Back"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)} // ← Changed: Pass entire item object
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete & Return to Bank"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};