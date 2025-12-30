import React, { useEffect, useState } from 'react';
import { Plus, PiggyBank, Target, CheckCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTabung,
  createTabung,
  updateTabung,
  deleteTabung,
  saveToTabung,
  withdrawFromTabung,
  fetchTabungTransactions,
} from './tabungSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { TabungList } from './TabungList';
import { AddTabungModal } from './AddTabungModal';
import { EditTabungModal } from './EditTabungModal';
import { SaveMoneyModal } from './SaveMoneyModal';
import { WithdrawMoneyModal } from './WithdrawMoneyModal';
import { DeleteTabungModal } from './DeleteTabungModal';
import { TransactionHistoryModal } from './TransactionHistoryModal';
import { TabungStatsSkeleton, TabungListSkeleton } from './TabungSkeleton';
import { Tabung, UserRole } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

export const TabungPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, transactions, loading } = useAppSelector((state) => state.tabung);
  const { balances } = useAppSelector((state) => state.balance);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [userFilter, setUserFilter] = useState<'all' | UserRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTabung, setSelectedTabung] = useState<Tabung | null>(null);

  const isInitialLoading = loading && items.length === 0;

  useEffect(() => {
    dispatch(fetchTabung());
    dispatch(fetchBalances());
  }, [dispatch]);

  // Filter items based on user selection
  const filteredItems = userFilter === 'all' 
    ? items 
    : items.filter((item) => item.user === userFilter);

  // Calculate stats
  const totalSaved = filteredItems.reduce((sum, item) => sum + item.savedAmount, 0);
  const activeTabung = filteredItems.filter((item) => item.status === 'active').length;
  const completedTabung = filteredItems.filter((item) => item.status === 'completed').length;

  // Get bank balance for current user
  const userBalance = balances.find((b) => b.user === (currentUser?.role || 'husband'));
  const bankBalance = userBalance?.bank || 0;

  const handleAddTabung = () => {
    setShowAddModal(true);
  };

  const handleCreateTabung = async (data: {
    user: UserRole;
    name: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
  }) => {
    await dispatch(createTabung(data)).unwrap();
    dispatch(fetchTabung());
  };

  const handleEditTabung = (tabung: Tabung) => {
    setSelectedTabung(tabung);
    setShowEditModal(true);
  };

  const handleUpdateTabung = async (
    id: string,
    data: {
      name?: string;
      description?: string;
      targetAmount?: number;
      targetDate?: string;
    }
  ) => {
    await dispatch(updateTabung({ id, data })).unwrap();
    dispatch(fetchTabung());
  };

  const handleSaveToTabung = (tabung: Tabung) => {
    setSelectedTabung(tabung);
    setShowSaveModal(true);
  };

  const handleSaveMoney = async (id: string, amount: number, reason?: string) => {
    await dispatch(saveToTabung({ id, amount, reason })).unwrap();
    await dispatch(fetchBalances()).unwrap();
    dispatch(fetchTabung());
  };

  const handleWithdrawFromTabung = (tabung: Tabung) => {
    setSelectedTabung(tabung);
    setShowWithdrawModal(true);
  };

  const handleWithdrawMoney = async (id: string, amount: number, reason?: string) => {
    await dispatch(withdrawFromTabung({ id, amount, reason })).unwrap();
    await dispatch(fetchBalances()).unwrap();
    dispatch(fetchTabung());
  };

  const handleDeleteTabung = (tabung: Tabung) => {
    setSelectedTabung(tabung);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (tabungId: string) => {
    await dispatch(deleteTabung(tabungId)).unwrap();
    await dispatch(fetchBalances()).unwrap();
  };

  const handleViewHistory = (tabung: Tabung) => {
    setSelectedTabung(tabung);
    setShowHistoryModal(true);
  };

  const handleLoadTransactions = (tabungId: string) => {
    dispatch(fetchTabungTransactions(tabungId));
  };

  const userFilterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'husband', label: 'Husband Only' },
    { value: 'wife', label: 'Wife Only' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tabung (Savings)</h1>
          <p className="text-gray-600 mt-1">Track your savings goals and progress</p>
        </div>
        <Button onClick={handleAddTabung}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tabung
        </Button>
      </div>

      {/* User Filter */}
      <div className="flex justify-end">
        <div className="w-64">
          <Select
            options={userFilterOptions}
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value as 'all' | UserRole)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      {isInitialLoading ? (
        <TabungStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <PiggyBank className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalSaved)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{activeTabung}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Goals</p>
                <p className="text-3xl font-bold text-purple-600">{completedTabung}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabung List */}
      {isInitialLoading ? (
        <TabungListSkeleton />
      ) : (
        <TabungList
          items={filteredItems}
          loading={loading}
          onSave={handleSaveToTabung}
          onWithdraw={handleWithdrawFromTabung}
          onEdit={handleEditTabung}
          onDelete={handleDeleteTabung}
          onViewHistory={handleViewHistory}
        />
      )}

      {/* Add Tabung Modal */}
      <AddTabungModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        user={currentUser?.role || 'husband'}
        onSubmit={handleCreateTabung}
      />

      {/* Edit Tabung Modal */}
      <EditTabungModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTabung(null);
        }}
        tabung={selectedTabung}
        onSubmit={handleUpdateTabung}
      />

      {/* Save Money Modal */}
      <SaveMoneyModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSelectedTabung(null);
        }}
        tabung={selectedTabung}
        bankBalance={bankBalance}
        onSubmit={handleSaveMoney}
      />

      {/* Withdraw Money Modal */}
      <WithdrawMoneyModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false);
          setSelectedTabung(null);
        }}
        tabung={selectedTabung}
        onSubmit={handleWithdrawMoney}
      />

      {/* Delete Tabung Modal */}
      <DeleteTabungModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTabung(null);
        }}
        tabung={selectedTabung}
        onConfirm={handleConfirmDelete}
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedTabung(null);
        }}
        tabung={selectedTabung}
        transactions={selectedTabung ? transactions[selectedTabung.id] || [] : []}
        loading={loading}
        onLoadTransactions={handleLoadTransactions}
      />
    </div>
  );
};