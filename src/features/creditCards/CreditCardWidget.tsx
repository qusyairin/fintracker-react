import React from 'react';
import { CreditCard as CreditCardIcon, AlertCircle } from 'lucide-react';
import { CreditCard } from '../../types';
import { formatCurrency, getDaysUntilDate } from '../../utils/dateUtils';

interface CreditCardWidgetProps {
  card: CreditCard;
}

export const CreditCardWidget: React.FC<CreditCardWidgetProps> = ({ card }) => {
  const utilization = (card.outstandingBalance / card.creditLimit) * 100;
  const availableCredit = card.creditLimit - card.outstandingBalance;
  const minimumPayment = card.outstandingBalance * (card.minimumPaymentPercent / 100);

  const getDueDate = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, currentMonth, card.paymentDueDate);

    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    return dueDate.toISOString().split('T')[0];
  };

  const daysUntilDue = getDaysUntilDate(getDueDate());

  const getUtilizationColor = () => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-orange-500';
    if (utilization >= 50) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getUtilizationBgColor = () => {
    if (utilization >= 90) return 'bg-red-600';
    if (utilization >= 75) return 'bg-orange-500';
    if (utilization >= 50) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
          <p className="text-sm text-gray-600">{card.bank}</p>
        </div>
        <CreditCardIcon className="w-8 h-8 text-blue-600" />
      </div>

      <div className="relative pt-1 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-bold ${getUtilizationColor()}`}>
            {utilization.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-600">utilized</span>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - utilization / 100)}`}
                className={getUtilizationBgColor()}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-600">Outstanding</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(card.outstandingBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Credit Limit</span>
          <span className="font-semibold text-gray-900">{formatCurrency(card.creditLimit)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Available Credit</span>
          <span className="font-semibold text-green-600">{formatCurrency(availableCredit)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Min. Payment</span>
          <span className="font-semibold text-gray-900">{formatCurrency(minimumPayment)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Payment Due</span>
          <div className="text-right">
            <span className="font-semibold text-gray-900">{daysUntilDue} days</span>
            {daysUntilDue <= 3 && (
              <div className="flex items-center text-xs text-red-600 mt-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                Due soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
