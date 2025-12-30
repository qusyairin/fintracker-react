import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBalances, updateBalance } from './balanceSlice';
import { fetchBalanceHistory, addBalanceHistory } from './balanceHistorySlice';
import { fetchReservedItems } from '../reserved/reservedSlice';
import { BalanceCard } from './BalanceCard';
import { BalanceHistoryList } from './BalanceHistoryList';
import { BalanceCardSkeleton } from '../dashboard/DashboardSkeleton';
import { UserRole } from '../../types';

export const BalancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { balances, loading: balancesLoading } = useAppSelector((state) => state.balance);
  const { history, loading: historyLoading } = useAppSelector((state) => state.balanceHistory);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const yourBalance = balances.find((b) => b.user === 'husband');
  const wifeBalance = balances.find((b) => b.user === 'wife');

  const isInitialLoading = balancesLoading && balances.length === 0;

  useEffect(() => {
    dispatch(fetchBalances());
    dispatch(fetchBalanceHistory());
    dispatch(fetchReservedItems());
  }, [dispatch]);

  const handleBalanceUpdate = async (
    user: UserRole,
    field: 'cash' | 'bank' | 'setAside',
    newValue: number,
    reason?: string
  ): Promise<void> => { // ← Add return type
    const balance = balances.find((b) => b.user === user);
    if (!balance) return;

    const oldValue = balance[field];

    try {
      // Update balance
      await dispatch(updateBalance({
        user,
        data: { [field]: newValue },
      })).unwrap();

      // Add to history
      await dispatch(addBalanceHistory({
        user,
        changedBy: currentUser?.role || 'husband',
        field,
        oldValue,
        newValue,
        reason,
      })).unwrap();

      // Refresh data
      await dispatch(fetchBalances()).unwrap();
    } catch (error) {
      console.error('Failed to update balance:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Balance Management</h1>
        <p className="text-gray-600 mt-1">Manage and track your wallet and bank balances</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isInitialLoading ? (
          <>
            <BalanceCardSkeleton title="Husband's Balance" />
            <BalanceCardSkeleton title="Wife's Balance" />
          </>
        ) : (
          <>
            {yourBalance && (
              <BalanceCard
                balance={yourBalance}
                currentUser={currentUser?.role || 'husband'}
                onUpdate={(field, newValue, reason) => 
                  handleBalanceUpdate('husband', field, newValue, reason)
                }
              />
            )}
            {wifeBalance && (
              <BalanceCard
                balance={wifeBalance}
                currentUser={currentUser?.role || 'husband'}
                onUpdate={(field, newValue, reason) => 
                  handleBalanceUpdate('wife', field, newValue, reason)
                }
              />
            )}
          </>
        )}
      </div>

      {/* History */}
      <BalanceHistoryList history={history} loading={historyLoading} />
    </div>
  );
};