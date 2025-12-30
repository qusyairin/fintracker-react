import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Bill } from '../../types';
import { formatCurrency, getDaysUntilDate } from '../../utils/dateUtils';

interface UpcomingBillsListProps {
  bills: Bill[];
}

export const UpcomingBillsList: React.FC<UpcomingBillsListProps> = ({ bills }) => {
  const getBillUrgency = (daysUntil: number): 'danger' | 'warning' | 'info' => {
    if (daysUntil <= 3) return 'danger';
    if (daysUntil <= 7) return 'warning';
    return 'info';
  };

  return (
    <Card title="Upcoming Bills">
      <div className="space-y-3">
        {bills.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming bills</p>
            <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          bills.map((bill) => {
            const daysUntil = getDaysUntilDate(bill.dueDate);
            const urgency = getBillUrgency(daysUntil);

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle
                    className={`w-5 h-5 ${
                      urgency === 'danger'
                        ? 'text-red-500'
                        : urgency === 'warning'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{bill.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(bill.amount)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={urgency} size="sm">
                    {daysUntil === 0 ? 'Due Today' : `${daysUntil}d`}
                  </Badge>
                </div>
              </div>
            );
          })
        )}

        {bills.length > 0 && (
          <Button variant="secondary" size="sm" fullWidth>
            View All Bills
          </Button>
        )}
      </div>
    </Card>
  );
};
