import React, { useEffect } from 'react';
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCreditCards, fetchInstallments } from './creditCardSlice';
import { CreditCardWidget } from './CreditCardWidget';
import { Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils/dateUtils';

export const CreditCardsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cards, installments, loading } = useAppSelector((state) => state.creditCard);

  useEffect(() => {
    dispatch(fetchCreditCards());
    dispatch(fetchInstallments());
  }, [dispatch]);

  const totalOutstanding = cards.reduce((sum, card) => sum + card.outstandingBalance, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalAvailable = totalLimit - totalOutstanding;
  const averageUtilization = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Cards</h1>
          <p className="text-gray-600 mt-1">Manage your credit cards and track spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Limit</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLimit)}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Available Credit</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAvailable)}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Avg. Utilization</p>
            <p className="text-2xl font-bold text-gray-900">{averageUtilization.toFixed(1)}%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CreditCardWidget key={card.id} card={card} />
        ))}
      </div>

      {installments.length > 0 && (
        <Card title="Active Installment Plans">
          <div className="space-y-4">
            {installments.map((installment) => {
              const progress = (installment.paidInstallments / installment.totalInstallments) * 100;
              const remaining = installment.totalInstallments - installment.paidInstallments;

              return (
                <div key={installment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{installment.itemName}</h4>
                      <p className="text-sm text-gray-600">
                        Card: {installment.cardType.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(installment.monthlyInstallment)}/mo
                      </p>
                      <p className="text-sm text-gray-600">{remaining} months left</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {installment.paidInstallments} / {installment.totalInstallments} paid
                      </span>
                      <span className="font-medium text-gray-900">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
