import React from 'react';
import { Skeleton } from '../../components/common/Skeleton';
import { Card } from '../../components/common/Card';

export const TabungCardSkeleton: React.FC = () => {
  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </Card>
  );
};

export const TabungStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const TabungListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <TabungCardSkeleton key={i} />
      ))}
    </div>
  );
};