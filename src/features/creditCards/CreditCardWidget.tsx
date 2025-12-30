import React from 'react';
import { CreditCard as CreditCardIcon, Edit, FileText, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { CreditCard } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface CreditCardWidgetProps {
  card: CreditCard;
  onEdit: (card: CreditCard) => void;
  onUpdateStatement: (card: CreditCard) => void;
  onMakePayment: (card: CreditCard) => void;
}

export const CreditCardWidget: React.FC<CreditCardWidgetProps> = ({
  card,
  onEdit,
  onUpdateStatement,
  onMakePayment,
}) => {
  const utilizationPercent = (card.outstandingBalance / card.creditLimit) * 100;
  const availableLimit = card.availableLimit || (card.creditLimit - card.outstandingBalance);

  const getUtilizationColor = (percent: number) => {
    if (percent >= 80) return 'text-red-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 80) return 'bg-red-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              card.user === 'husband' ? 'bg-blue-100' : 'bg-pink-100'
            }`}>
              <CreditCardIcon className={`w-5 h-5 ${
                card.user === 'husband' ? 'text-blue-600' : 'text-pink-600'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{card.name}</h3>
              <p className="text-xs text-gray-500">{card.bank}</p>
            </div>
          </div>
          <button
            onClick={() => onEdit(card)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Card Details"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>

        {/* Credit Limit & Outstanding */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Credit Limit</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(card.creditLimit)}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Outstanding</span>
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(card.outstandingBalance)}
            </span>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Utilization</span>
              <span className={`font-semibold ${getUtilizationColor(utilizationPercent)}`}>
                {utilizationPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(utilizationPercent)}`}
                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Available</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(availableLimit)}
            </span>
          </div>
        </div>

        {/* Statement Details */}
        {(card.statementBalance > 0 || card.minimumPayment > 0) && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase">Statement</h4>
            <div className="space-y-1 text-sm">
              {card.statementBalance > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(card.statementBalance)}
                  </span>
                </div>
              )}
              {card.minimumPayment > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Min. Payment:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(card.minimumPayment)}
                  </span>
                </div>
              )}
              {card.statementDueDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Due Date:</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {formatDate(card.statementDueDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onUpdateStatement(card)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Update Statement
          </button>
          <button
            onClick={() => onMakePayment(card)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            disabled={card.outstandingBalance === 0}
          >
            <DollarSign className="w-4 h-4" />
            Make Payment
          </button>
        </div>

        {/* Last Updated */}
        {card.lastStatementDate && (
          <p className="text-xs text-gray-500 text-center">
            Last updated: {formatDate(card.lastStatementDate)}
          </p>
        )}
      </div>
    </Card>
  );
};