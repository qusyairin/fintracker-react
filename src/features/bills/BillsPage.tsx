import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBills, deleteBill } from './billSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { fetchCreditCards } from '../creditCards/creditCardSlice';
import { fetchExpenses } from '../expenses/expenseSlice';
import { BillList } from './BillList';
import { AddBillModal } from './AddBillModal';
import { PayBillModal } from './PayBillModal';
import { Bill } from '../../types';
import { formatCurrency, getCurrentMonth } from '../../utils/dateUtils';

export const BillsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bills, loading } = useAppSelector((state) => state.bill);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>(undefined);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  const currentMonth = getCurrentMonth();

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const unpaidBills = bills.filter((bill) => !bill.isPaid);
  const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = bills.filter((bill) => bill.isPaid);

  const handleAddBill = () => {
    setEditingBill(undefined);
    setIsAddModalOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsAddModalOpen(true);
  };

  const handleMarkAsPaid = (bill: Bill) => {
    setPayingBill(bill);
    setIsPayModalOpen(true);
  };

  const handleDeleteBill = async (billId: string) => {
    try {
      await dispatch(deleteBill(billId)).unwrap();
      await dispatch(fetchBalances());
      await dispatch(fetchCreditCards());
      await dispatch(fetchExpenses(currentMonth));
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  };

  const handleAddModalSuccess = () => {
    dispatch(fetchBills());
  };

  const handlePayModalSuccess = () => {
    dispatch(fetchBills());
    dispatch(fetchBalances());
    dispatch(fetchCreditCards());
    dispatch(fetchExpenses(currentMonth));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bills & Payments</h1>
          <p className="text-gray-600 mt-1">Track your bills and due dates</p>
        </div>
        <Button onClick={handleAddBill}>
          <Plus className="w-4 h-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Unpaid Bills</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalUnpaid)}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Unpaid Count</p>
            <p className="text-3xl font-bold text-orange-600">{unpaidBills.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 mb-1">Paid This Month</p>
            <p className="text-3xl font-bold text-green-600">{paidBills.length}</p>
          </div>
        </Card>
      </div>

      {/* Unpaid Bills */}
      <Card title="Unpaid Bills">
        {unpaidBills.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">All bills paid!</p>
            <p className="text-gray-600 mt-2">You have no outstanding bills</p>
          </div>
        ) : (
          <BillList
            bills={unpaidBills}
            loading={loading}
            onMarkAsPaid={handleMarkAsPaid}
            onEdit={handleEditBill}
            onDelete={handleDeleteBill}
          />
        )}
      </Card>

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <Card title="Paid Bills">
          <BillList
            bills={paidBills}
            loading={false}
            showPaidStatus
            onEdit={handleEditBill}
            onDelete={handleDeleteBill}
          />
        </Card>
      )}

      {/* Add/Edit Bill Modal */}
      <AddBillModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBill(undefined);
        }}
        bill={editingBill}
        onSuccess={handleAddModalSuccess}
      />

      {/* Pay Bill Modal */}
      <PayBillModal
        isOpen={isPayModalOpen}
        onClose={() => {
          setIsPayModalOpen(false);
          setPayingBill(null);
        }}
        bill={payingBill}
        onSuccess={handlePayModalSuccess}
      />
    </div>
  );
};