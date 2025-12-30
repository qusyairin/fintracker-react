import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils/dateUtils';

interface QuickStatsProps {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  currentBalance,
  monthlyIncome,
  monthlyExpenses,
  monthlySurplus,
}) => {
  const stats = [
    {
      title: 'Current Balance',
      value: formatCurrency(currentBalance),
      icon: <Wallet className="w-6 h-6" />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Income This Month',
      value: formatCurrency(monthlyIncome),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Expenses This Month',
      value: formatCurrency(monthlyExpenses),
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'Monthly Surplus',
      value: formatCurrency(monthlySurplus),
      icon: <Target className="w-6 h-6" />,
      color: monthlySurplus >= 0 ? 'green' : 'red',
      bgColor: monthlySurplus >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: monthlySurplus >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
