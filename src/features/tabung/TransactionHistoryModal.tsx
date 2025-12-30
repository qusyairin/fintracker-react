import React, { useEffect } from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Tabung, TabungTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabung: Tabung | null;
  transactions: TabungTransaction[];
  loading: boolean;
  onLoadTransactions: (tabungId: string) => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  tabung,
  transactions,
  loading,
  onLoadTransactions,
}) => {
  useEffect(() => {
    if (isOpen && tabung) {
      onLoadTransactions(tabung.id);
    }
  }, [isOpen, tabung, onLoadTransactions]);

  if (!tabung) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction History" size="lg">
      <div className="space-y-4">
        {/* Tabung Info */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{tabung.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Current Saved</p>
              <p className="font-bold text-gray-900">{formatCurrency(tabung.savedAmount)}</p>
            </div>
            <div>
              <p className="text-gray-600">Target</p>
              <p className="font-bold text-gray-900">{formatCurrency(tabung.targetAmount)}</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Start saving to see your transaction history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Details */}
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === 'save'
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {transaction.type === 'save' ? (
                          <TrendingDown className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={transaction.type === 'save' ? 'success' : 'info'}
                            size="sm"
                          >
                            {transaction.type === 'save' ? 'Saved' : 'Withdrawn'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatDate(transaction.transactionDate)}
                          </span>
                        </div>

                        {transaction.reason && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {transaction.reason}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Previous: {formatCurrency(transaction.previousAmount)}</span>
                          <span>→</span>
                          <span>New: {formatCurrency(transaction.newAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount */}
                    <div className="text-right ml-4">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'save'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {transaction.type === 'save' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};