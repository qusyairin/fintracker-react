import React from 'react';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Skeleton';

export const QuickStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
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

export const BalanceCardSkeleton: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Card title={title}>
      <div className="space-y-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="pt-2 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export const UpcomingBillsSkeleton: React.FC = () => {
  return (
    <Card title="Upcoming Bills">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};