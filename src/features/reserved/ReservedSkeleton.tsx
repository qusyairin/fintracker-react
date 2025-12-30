import React from 'react';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Skeleton';

export const ReservedItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="text-right space-y-3">
          <Skeleton className="h-6 w-24 ml-auto" />
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReservedListSkeleton: React.FC = () => {
  return (
    <Card title="Reserved Items">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <ReservedItemSkeleton key={i} />
        ))}
      </div>
    </Card>
  );
};

export const ReservedStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </Card>
      ))}
    </div>
  );
};