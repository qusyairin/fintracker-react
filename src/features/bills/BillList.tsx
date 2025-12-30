import React from 'react';
import { CheckCircle2, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Bill } from '../../types';
import { formatDate, formatCurrency, getDaysUntilDate } from '../../utils/dateUtils';

interface BillListProps {
  bills: Bill[];
  loading: boolean;
  showPaidStatus?: boolean;
  onMarkAsPaid?: (bill: Bill) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void; // ← Changed from (billId: string)
}

export const BillList: React.FC<BillListProps> = ({
  bills,
  loading,
  onMarkAsPaid,
  onEdit,
  onDelete,
  showPaidStatus = false,
}) => {
  const getBillUrgency = (daysUntil: number): 'danger' | 'warning' | 'info' => {
    if (daysUntil <= 3) return 'danger';
    if (daysUntil <= 7) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading bills...</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No bills to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => {
        const daysUntil = getDaysUntilDate(bill.dueDate);
        const urgency = getBillUrgency(daysUntil);

        return (
          <div
            key={bill.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              {bill.isPaid ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle
                  className={`w-6 h-6 ${
                    urgency === 'danger'
                      ? 'text-red-500'
                      : urgency === 'warning'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`}
                />
              )}

              <div>
                <h4 className="font-semibold text-gray-900">{bill.name}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-sm text-gray-600">
                    Due: {formatDate(bill.dueDate)}
                  </p>
                  {bill.recurring && (
                    <Badge variant="info" size="sm">
                      Recurring
                    </Badge>
                  )}
                  {showPaidStatus && bill.paidDate && (
                    <span className="text-xs text-green-600">
                      Paid on {formatDate(bill.paidDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
                {!bill.isPaid && (
                  <Badge variant={urgency} size="sm">
                    {daysUntil === 0 ? 'Due Today' : daysUntil < 0 ? 'Overdue' : `${daysUntil}d`}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(bill)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(bill)} // ← Changed: Pass entire bill object
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Mark Paid Button */}
                {!bill.isPaid && onMarkAsPaid && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onMarkAsPaid(bill)}
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};