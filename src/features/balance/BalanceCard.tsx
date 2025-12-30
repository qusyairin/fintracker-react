import React, { useState } from 'react';
import { Wallet, Plus, Minus, Edit2, Save, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { UserBalance, UserRole } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface BalanceCardProps {
  balance: UserBalance;
  currentUser: UserRole;
  onUpdate: (field: 'cash' | 'bank' | 'setAside', newValue: number, reason?: string) => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currentUser, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [adjustMode, setAdjustMode] = useState<'cash' | 'bank' | 'setAside' | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [reason, setReason] = useState('');
  
  const [editValues, setEditValues] = useState({
    cash: balance.cash,
    bank: balance.bank,
    setAside: balance.setAside,
  });

  const handleEditSave = () => {
    if (editValues.cash !== balance.cash) {
      onUpdate('cash', editValues.cash, reason || undefined);
    }
    if (editValues.bank !== balance.bank) {
      onUpdate('bank', editValues.bank, reason || undefined);
    }
    if (editValues.setAside !== balance.setAside) {
      onUpdate('setAside', editValues.setAside, reason || undefined);
    }
    setEditMode(false);
    setReason('');
  };

  const handleAdjust = (field: 'cash' | 'bank' | 'setAside', isAdd: boolean) => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const currentValue = balance[field];
    const newValue = isAdd ? currentValue + amount : currentValue - amount;
    
    if (newValue < 0) {
      alert('Balance cannot be negative');
      return;
    }

    onUpdate(field, newValue, reason || undefined);
    setAdjustMode(null);
    setAdjustAmount('');
    setReason('');
  };

  const title = balance.user === 'husband' ? 'Your Balance' : "Wife's Balance";
  const colorClass = balance.user === 'husband' ? 'text-blue-600' : 'text-pink-600';

  return (
    <Card
      title={title}
      icon={<Wallet className="w-5 h-5" />}
      actions={
        !editMode && !adjustMode ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditMode(true)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        ) : null
      }
    >
      <div className="space-y-4">
        {/* Balance Breakdown */}
        <div className="space-y-3">
          {/* Cash on Hand */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Cash on Hand</span>
            {editMode ? (
              <input
                type="number"
                value={editValues.cash}
                onChange={(e) => setEditValues({ ...editValues, cash: parseFloat(e.target.value) || 0 })}
                className="w-32 px-2 py-1 text-sm font-semibold text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(balance.cash)}
                </span>
                {!adjustMode && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setAdjustMode('cash')}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {adjustMode === 'cash' && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" onClick={() => handleAdjust('cash', true)}>
                  <Plus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleAdjust('cash', false)}>
                  <Minus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setAdjustMode(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Bank Account */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Bank Account</span>
            {editMode ? (
              <input
                type="number"
                value={editValues.bank}
                onChange={(e) => setEditValues({ ...editValues, bank: parseFloat(e.target.value) || 0 })}
                className="w-32 px-2 py-1 text-sm font-semibold text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(balance.bank)}
                </span>
                {!adjustMode && (
                  <button
                    onClick={() => setAdjustMode('bank')}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {adjustMode === 'bank' && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" onClick={() => handleAdjust('bank', true)}>
                  <Plus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleAdjust('bank', false)}>
                  <Minus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setAdjustMode(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Set Aside */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Set Aside</span>
            {editMode ? (
              <input
                type="number"
                value={editValues.setAside}
                onChange={(e) => setEditValues({ ...editValues, setAside: parseFloat(e.target.value) || 0 })}
                className="w-32 px-2 py-1 text-sm font-semibold text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(balance.setAside)}
                </span>
                {!adjustMode && (
                  <button
                    onClick={() => setAdjustMode('setAside')}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {adjustMode === 'setAside' && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" onClick={() => handleAdjust('setAside', true)}>
                  <Plus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleAdjust('setAside', false)}>
                  <Minus className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setAdjustMode(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Edit Mode Reason */}
        {editMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <input
              type="text"
              placeholder="Why are you making these changes?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Total */}
        <div className="pt-3 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-700">Total Balance</span>
            <span className={`text-2xl font-bold ${colorClass}`}>
              {formatCurrency(editMode 
                ? editValues.cash + editValues.bank + editValues.setAside 
                : balance.total
              )}
            </span>
          </div>
        </div>

        {/* Edit Mode Actions */}
        {editMode && (
          <div className="flex gap-2 pt-2">
            <Button onClick={handleEditSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setEditMode(false);
                setEditValues({
                  cash: balance.cash,
                  bank: balance.bank,
                  setAside: balance.setAside,
                });
                setReason('');
              }}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};