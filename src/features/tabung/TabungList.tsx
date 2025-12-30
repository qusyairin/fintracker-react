import React from 'react';
import { PiggyBank } from 'lucide-react';
import { Tabung } from '../../types';
import { TabungCard } from './TabungCard';

interface TabungListProps {
  items: Tabung[];
  loading: boolean;
  onSave: (tabung: Tabung) => void;
  onWithdraw: (tabung: Tabung) => void;
  onEdit: (tabung: Tabung) => void;
  onDelete: (tabung: Tabung) => void;
  onViewHistory: (tabung: Tabung) => void;
}

export const TabungList: React.FC<TabungListProps> = ({
  items,
  loading,
  onSave,
  onWithdraw,
  onEdit,
  onDelete,
  onViewHistory,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading tabung...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PiggyBank className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600 font-medium">No tabung created yet</p>
        <p className="text-sm text-gray-500 mt-1">Start saving by creating your first tabung</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((tabung) => (
        <TabungCard
          key={tabung.id}
          tabung={tabung}
          onSave={onSave}
          onWithdraw={onWithdraw}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
};