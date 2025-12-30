import React from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { BalanceHistory } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/dateUtils';

interface BalanceHistoryListProps {
  history: BalanceHistory[];
  loading: boolean;
}

export const BalanceHistoryList: React.FC<BalanceHistoryListProps> = ({ history, loading }) => {
  const getFieldLabel = (field: string): string => {
    switch (field) {
      case 'cash':
        return 'Wallet';
      case 'bank':
        return 'Bank Balance';
      case 'setAside':
        return 'Reserved';
      default:
        return field;
    }
  };

  if (loading) {
    return (
      <Card title="Change History" icon={<History className="w-5 h-5" />}>
        <div className="text-center py-8 text-gray-500">Loading history...</div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card title="Change History" icon={<History className="w-5 h-5" />}>
        <div className="text-center py-8 text-gray-500">No balance changes yet</div>
      </Card>
    );
  }

  return (
    <Card title="Change History" icon={<History className="w-5 h-5" />}>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((entry) => {
          const isIncrease = entry.newValue > entry.oldValue;
          const difference = Math.abs(entry.newValue - entry.oldValue);
          
          return (
            <div
              key={entry.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {entry.user === 'husband' ? "Husband's" : "Wife's"} {getFieldLabel(entry.field)}
                    </span>
                    {isIncrease ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Changed by {entry.changedBy === 'husband' ? "Husband's" : 'Wife'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncrease ? '+' : '-'}{formatCurrency(difference)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(entry.oldValue)} → {formatCurrency(entry.newValue)}
                  </div>
                </div>
              </div>
              
              {entry.reason && (
                <p className="text-sm text-gray-600 italic mb-2">"{entry.reason}"</p>
              )}
              
              <p className="text-xs text-gray-400">{formatDateTime(entry.timestamp)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};