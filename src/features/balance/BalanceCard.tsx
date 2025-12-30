import React, { useState } from 'react';
import { Pencil, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Balance, UserRole } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface BalanceCardProps {
  balance: Balance;
  currentUser: UserRole;
  onUpdate: (field: 'cash' | 'bank' | 'setAside', newValue: number, reason?: string) => Promise<void>;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currentUser, onUpdate }) => {
  const [editingField, setEditingField] = useState<'cash' | 'bank' | 'setAside' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [reason, setReason] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // ← Add loading state

  const isOwnBalance = currentUser === balance.user;
  const total = balance.cash + balance.bank + balance.setAside;

  const handleEdit = (field: 'cash' | 'bank' | 'setAside') => {
    setEditingField(field);
    setEditValue(balance[field].toString());
    setReason('');
  };

  const handleSave = async () => {
    if (editingField) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue) && newValue >= 0) {
        setIsSaving(true); // ← Start loading
        try {
          await onUpdate(editingField, newValue, reason.trim() || undefined);
          setEditingField(null);
          setEditValue('');
          setReason('');
        } catch (error) {
          console.error('Failed to update balance:', error);
          // Keep the editing state so user can retry
        } finally {
          setIsSaving(false); // ← End loading
        }
      }
    }
  };

  const handleCancel = () => {
    if (!isSaving) { // ← Prevent cancel while saving
      setEditingField(null);
      setEditValue('');
      setReason('');
    }
  };

  const getFieldLabel = (field: 'cash' | 'bank' | 'setAside'): string => {
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

  const userColor = balance.user === 'husband' ? 'blue' : 'pink';

  return (
    <Card
      title={
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
          disabled={isSaving} // ← Disable while saving
        >
          <span>{balance.user === 'husband' ? "Husband's Balance" : "Wife's Balance"}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      }
    >
      <div className="space-y-4">
        {/* Total (Always Visible) */}
        <div className="pb-4 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-700">Total</span>
            <span className={`text-3xl font-bold text-${userColor}-600`}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Breakdown (Collapsible) */}
        {isExpanded && (
          <div className="space-y-3">
            {(['cash', 'bank', 'setAside'] as const).map((field) => (
              <div key={field} className="p-3 bg-gray-50 rounded-lg">
                {editingField === field ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {getFieldLabel(field)}
                      </span>
                    </div>
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="New amount"
                      step="0.01"
                      min="0"
                      autoFocus
                      disabled={isSaving} // ← Disable while saving
                    />
                    <Input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason (optional)"
                      disabled={isSaving} // ← Disable while saving
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={handleSave}
                        disabled={isSaving} // ← Disable while saving
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isSaving} // ← Disable while saving
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {getFieldLabel(field)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(balance[field])}
                      </p>
                    </div>
                    {field !== 'setAside' && isOwnBalance && (
                      <button
                        onClick={() => handleEdit(field)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                        disabled={isSaving} // ← Disable while saving
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                {field === 'setAside' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Managed via Reserved page
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {!isOwnBalance && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              You can only edit your own balance
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};