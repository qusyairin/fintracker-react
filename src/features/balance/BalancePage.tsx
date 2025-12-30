import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateBalance } from './balanceSlice';
import { fetchBalanceHistory, addBalanceHistory } from './balanceHistorySlice';
import { BalanceCard } from './BalanceCard';
import { BalanceHistoryList } from './BalanceHistoryList';
import { UserRole } from '../../types';

export const BalancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { balances } = useAppSelector((state) => state.balance);
  const { history, loading } = useAppSelector((state) => state.balanceHistory);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const yourBalance = balances.find((b) => b.user === 'husband');
  const wifeBalance = balances.find((b) => b.user === 'wife');

  useEffect(() => {
    dispatch(fetchBalanceHistory());
  }, [dispatch]);

  const handleBalanceUpdate = async (
    user: UserRole,
    field: 'cash' | 'bank' | 'setAside',
    newValue: number,
    reason?: string
  ) => {
    const balance = balances.find((b) => b.user === user);
    if (!balance) return;

    const oldValue = balance[field];

    // Update balance
    await dispatch(updateBalance({
      user,
      data: { [field]: newValue },
    }));

    // Add to history
    await dispatch(addBalanceHistory({
      user,
      changedBy: currentUser?.role || 'husband',
      field,
      oldValue,
      newValue,
      reason,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Balance Management</h1>
        <p className="text-gray-600 mt-1">Manage and track your wallet and bank balances</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* History */}
      <BalanceHistoryList history={history} loading={loading} />
    </div>
  );
};