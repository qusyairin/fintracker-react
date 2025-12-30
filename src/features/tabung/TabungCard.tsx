import React from 'react';
import { PiggyBank, Calendar, Target, TrendingUp, Pencil, Trash2, History } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabung } from '../../types';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

interface TabungCardProps {
  tabung: Tabung;
  onSave: (tabung: Tabung) => void;
  onWithdraw: (tabung: Tabung) => void;
  onEdit: (tabung: Tabung) => void;
  onDelete: (tabung: Tabung) => void;
  onViewHistory: (tabung: Tabung) => void;
}

export const TabungCard: React.FC<TabungCardProps> = ({
  tabung,
  onSave,
  onWithdraw,
  onEdit,
  onDelete,
  onViewHistory,
}) => {
  const progress = tabung.progressPercentage || 0;
  const remaining = tabung.remainingAmount || 0;
  const isCompleted = tabung.status === 'completed';

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
              <PiggyBank className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{tabung.name}</h3>
              {tabung.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tabung.description}</p>
              )}
            </div>
          </div>
          {isCompleted && (
            <Badge variant="success" size="sm">
              🎉 Completed
            </Badge>
          )}
        </div>

        {/* Target Amount */}
        <div className="flex items-center justify-between py-2 border-y border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>Target</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(tabung.targetAmount)}
          </span>
        </div>

        {/* Saved Amount & Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Saved</span>
            <div className="text-right">
              <span className="font-bold text-gray-900">{formatCurrency(tabung.savedAmount)}</span>
              <span className="text-gray-500 ml-2">({progress}%)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Remaining */}
          {remaining > 0 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Remaining</span>
              <span className="font-medium">{formatCurrency(remaining)}</span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Created: {formatDate(tabung.startDate)}</span>
          </div>
          {tabung.targetDate && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>Target: {formatDate(tabung.targetDate)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="success"
            size="sm"
            onClick={() => onSave(tabung)}
            disabled={isCompleted}
          >
            <PiggyBank className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onWithdraw(tabung)}
            disabled={tabung.savedAmount === 0}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => onViewHistory(tabung)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
          >
            <History className="w-3 h-3" />
            History
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(tabung)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(tabung)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};