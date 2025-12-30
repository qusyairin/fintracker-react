import React, { useEffect, useState } from 'react';
import { CreditCard as CreditCardIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchCreditCards,
  fetchInstallments,
  updateCreditCard,
  updateStatement,
  makePayment,
  createInstallment,
  updateInstallment,
  deleteInstallment,
} from './creditCardSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { CreditCardWidget } from './CreditCardWidget';
import { EditCreditCardModal } from './EditCreditCardModal';
import { UpdateStatementModal } from './UpdateStatementModal';
import { MakeCCPaymentModal } from './MakeCCPaymentModal';
import { AddInstallmentModal } from './AddInstallmentModal';
import { EditInstallmentModal } from './EditInstallmentModal';
import { DeleteInstallmentModal } from './DeleteInstallmentModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CreditCard, Installment } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

export const CreditCardsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cards, installments, loading } = useAppSelector((state) => state.creditCard);

  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [updatingStatementCard, setUpdatingStatementCard] = useState<CreditCard | null>(null);
  const [payingCard, setPayingCard] = useState<CreditCard | null>(null);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [deletingInstallment, setDeletingInstallment] = useState<Installment | null>(null);

  useEffect(() => {
    dispatch(fetchCreditCards());
    dispatch(fetchInstallments());
    dispatch(fetchBalances());
  }, [dispatch]);

  const totalOutstanding = cards.reduce((sum, card) => sum + card.outstandingBalance, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalAvailable = totalLimit - totalOutstanding;
  const averageUtilization = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0;

  const activeInstallments = installments.filter((i) => i.status === 'active');

  // Credit Card Handlers
  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
  };

  const handleUpdateStatement = (card: CreditCard) => {
    setUpdatingStatementCard(card);
  };

  const handleMakePayment = (card: CreditCard) => {
    setPayingCard(card);
  };

  const handleEditSubmit = async (data: {
    name?: string;
    bank?: string;
    creditLimit?: number;
  }) => {
    if (!editingCard) return;
    await dispatch(updateCreditCard({ id: editingCard.id, data })).unwrap();
    await dispatch(fetchCreditCards());
  };

  const handleStatementSubmit = async (data: {
    statementBalance: number;
    minimumPayment: number;
    statementDueDate: string;
  }) => {
    if (!updatingStatementCard) return;
    await dispatch(updateStatement({ id: updatingStatementCard.id, data })).unwrap();
    await dispatch(fetchCreditCards());
  };

  const handlePaymentSubmit = async (data: {
    amount: number;
    paidBy: any;
    paymentDate: string;
    notes?: string;
  }) => {
    if (!payingCard) return;
    await dispatch(makePayment({ id: payingCard.id, data })).unwrap();
    await dispatch(fetchCreditCards());
    await dispatch(fetchBalances());
  };

  // Installment Handlers
  const handleAddInstallment = () => {
    setShowAddInstallment(true);
  };

  const handleCreateInstallment = async (data: {
    creditCardId: string;
    cardType: string;
    user: any;
    itemName: string;
    description?: string;
    totalAmount: number;
    monthlyInstallment: number;
    totalInstallments: number;
    interestRate?: number;
    startDate: string;
  }) => {
    await dispatch(createInstallment(data)).unwrap();
    await dispatch(fetchInstallments());
  };

  const handleEditInstallment = (installment: Installment) => {
    setEditingInstallment(installment);
  };

  const handleUpdateInstallment = async (data: {
    itemName?: string;
    description?: string;
    monthlyInstallment?: number;
    totalInstallments?: number;
    interestRate?: number;
  }) => {
    if (!editingInstallment) return;
    await dispatch(updateInstallment({ id: editingInstallment.id, data })).unwrap();
    await dispatch(fetchInstallments());
  };

  const handleDeleteInstallment = (installment: Installment) => {
    setDeletingInstallment(installment);
  };

  const handleConfirmDelete = async (id: string) => {
    await dispatch(deleteInstallment(id)).unwrap();
    await dispatch(fetchInstallments());
  };

  if (loading && cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Cards</h1>
          <p className="text-gray-600 mt-1">Manage your credit cards and track spending</p>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CreditCardWidget
            key={card.id}
            card={card}
            onEdit={handleEditCard}
            onUpdateStatement={handleUpdateStatement}
            onMakePayment={handleMakePayment}
          />
        ))}
      </div>

      {/* Active Installments */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Active Installment Plans</span>
            <Button size="sm" onClick={handleAddInstallment}>
              <Plus className="w-4 h-4 mr-2" />
              Add Installment
            </Button>
          </div>
        }
      >
        {activeInstallments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCardIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No active installment plans</p>
            <p className="text-sm text-gray-500 mt-1">
              Track your credit card installment purchases here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeInstallments.map((installment) => {
              const progress = (installment.paidInstallments / installment.totalInstallments) * 100;
              const remaining = installment.totalInstallments - installment.paidInstallments;

              return (
                <div key={installment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{installment.itemName}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          installment.user === 'husband' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {installment.user === 'husband' ? 'Husband' : 'Wife'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Card: {installment.cardType.toUpperCase()}
                      </p>
                      {installment.description && (
                        <p className="text-xs text-gray-500 mt-1">{installment.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditInstallment(installment)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInstallment(installment)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Monthly Payment</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(installment.monthlyInstallment)}/mo
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Remaining</p>
                      <p className="text-lg font-semibold text-gray-900">{remaining} months</p>
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
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total: {formatCurrency(installment.totalAmount)}</span>
                      {installment.interestRate > 0 && (
                        <span>Interest: {installment.interestRate}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Credit Card Modals */}
      <EditCreditCardModal
        isOpen={editingCard !== null}
        onClose={() => setEditingCard(null)}
        card={editingCard}
        onSubmit={handleEditSubmit}
      />

      <UpdateStatementModal
        isOpen={updatingStatementCard !== null}
        onClose={() => setUpdatingStatementCard(null)}
        card={updatingStatementCard}
        onSubmit={handleStatementSubmit}
      />

      <MakeCCPaymentModal
        isOpen={payingCard !== null}
        onClose={() => setPayingCard(null)}
        card={payingCard}
        onSubmit={handlePaymentSubmit}
      />

      {/* Installment Modals */}
      <AddInstallmentModal
        isOpen={showAddInstallment}
        onClose={() => setShowAddInstallment(false)}
        onSubmit={handleCreateInstallment}
      />

      <EditInstallmentModal
        isOpen={editingInstallment !== null}
        onClose={() => setEditingInstallment(null)}
        installment={editingInstallment}
        onSubmit={handleUpdateInstallment}
      />

      <DeleteInstallmentModal
        isOpen={deletingInstallment !== null}
        onClose={() => setDeletingInstallment(null)}
        installment={deletingInstallment}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};