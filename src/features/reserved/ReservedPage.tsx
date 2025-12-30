import React, { useEffect, useState } from 'react';
import { Plus, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchReservedItems, deleteReservedItem } from './reservedSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { ReservedList } from './ReservedList';
import { AddReservedModal } from './AddReservedModal';
import { EditReservedModal } from './EditReservedModal';
import { DepositModal } from './DepositModal';
import { DeleteReservedModal } from './DeleteReservedModal'; // ← Add this import
import { ReservedListSkeleton, ReservedStatsSkeleton } from './ReservedSkeleton';
import { Reserved, UserRole } from '../../types';
import { formatCurrency, getDaysUntilDate } from '../../utils/dateUtils';

export const ReservedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.reserved);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [userFilter, setUserFilter] = useState<'all' | UserRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Reserved | null>(null);
  const [deletingItem, setDeletingItem] = useState<Reserved | null>(null); // ← Add this state

  const isInitialLoading = loading && items.length === 0;

  useEffect(() => {
    dispatch(fetchReservedItems());
  }, [dispatch]);

  // Filter items based on user selection
  const filteredItems = userFilter === 'all' 
    ? items 
    : items.filter((item) => item.user === userFilter);

  // Calculate stats
  const totalReserved = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  const totalItems = filteredItems.length;
  
  // Count items with due dates in next 7 days
  const upcomingDue = filteredItems.filter((item) => {
    if (!item.dueDate) return false;
    const daysUntil = getDaysUntilDate(item.dueDate);
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;

  const handleAddReserved = () => {
    setShowAddModal(true);
  };

  const handleEditReserved = (item: Reserved) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDepositReserved = (item: Reserved) => {
    setSelectedItem(item);
    setShowDepositModal(true);
  };

  // ← Update this to open modal
  const handleDeleteReserved = (item: Reserved) => {
    setDeletingItem(item);
  };

  // ← Add this function for actual deletion
  const handleConfirmDelete = async (itemId: string) => {
    await dispatch(deleteReservedItem(itemId)).unwrap();
    await dispatch(fetchBalances());
  };

  const handleModalSuccess = () => {
    dispatch(fetchReservedItems());
    dispatch(fetchBalances());
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
          <h1 className="text-3xl font-bold text-gray-900">Reserved Money</h1>
          <p className="text-gray-600 mt-1">Track and manage your reserved funds</p>
        </div>
        <Button onClick={handleAddReserved}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reserved
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
        <ReservedStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reserved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalReserved)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Due This Week</p>
                <p className="text-3xl font-bold text-orange-600">{upcomingDue}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reserved Items List */}
      {isInitialLoading ? (
        <ReservedListSkeleton />
      ) : (
        <Card title="Reserved Items">
          <ReservedList
            items={filteredItems}
            loading={loading}
            onEdit={handleEditReserved}
            onDelete={handleDeleteReserved}
            onDeposit={handleDepositReserved}
          />
        </Card>
      )}

      {/* Add Reserved Modal */}
      <AddReservedModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        user={currentUser?.role || 'husband'}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Reserved Modal */}
      <EditReservedModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={handleModalSuccess}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Reserved Modal - ← Add this */}
      <DeleteReservedModal
        isOpen={deletingItem !== null}
        onClose={() => setDeletingItem(null)}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};