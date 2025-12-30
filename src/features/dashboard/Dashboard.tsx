import React, { useEffect, useState } from 'react';
import { Plus, Wallet, Info } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchExpenses } from '../expenses/expenseSlice';
import { fetchIncomes } from '../income/incomeSlice';
import { fetchUpcomingBills } from '../bills/billSlice';
import { fetchCreditCards } from '../creditCards/creditCardSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { 
  formatCurrency, 
  getCurrentMonth,
  getFinancialMonthRange,
  formatFinancialMonthRange,
  getFinancialMonthName,
} from '../../utils/dateUtils';
import { UpcomingBillsList } from '../bills/UpcomingBillsList';
import { QuickStats } from './QuickStats';
import { IncomeModal } from '../income/IncomeModal';
import { AddExpenseModal } from '../expenses/AddExpenseModal';
import { 
  QuickStatsSkeleton, 
  BalanceCardSkeleton, 
  UpcomingBillsSkeleton 
} from './DashboardSkeleton';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, loading: expensesLoading } = useAppSelector((state) => state.expense);
  const { incomes, loading: incomesLoading } = useAppSelector((state) => state.income);
  const { balances, loading: balancesLoading } = useAppSelector((state) => state.balance);
  const { upcomingBills, loading: billsLoading } = useAppSelector((state) => state.bill);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const currentMonth = getCurrentMonth();
  const { start: monthStart, end: monthEnd } = getFinancialMonthRange(currentMonth);
  const monthRangeText = formatFinancialMonthRange(currentMonth);
  const monthName = getFinancialMonthName(currentMonth);

  // Filter by date range for financial month
  const monthlyIncome = incomes
    .filter((inc) => inc.date >= monthStart && inc.date <= monthEnd && inc.status === 'approved')
    .reduce((sum, inc) => sum + inc.amount, 0);

  const monthlyExpenses = expenses
    .filter((exp) => exp.date >= monthStart && exp.date <= monthEnd && exp.status === 'approved')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthlySurplus = monthlyIncome - monthlyExpenses;

  const yourBalance = balances.find((b) => b.user === 'husband');
  const wifeBalance = balances.find((b) => b.user === 'wife');

  // Calculate totals from components for accuracy
  const husbandTotal = (yourBalance?.cash || 0) + (yourBalance?.bank || 0) + (yourBalance?.setAside || 0);
  const wifeTotal = (wifeBalance?.cash || 0) + (wifeBalance?.bank || 0) + (wifeBalance?.setAside || 0);
  const totalBalance = husbandTotal + wifeTotal;

  // Check if initial data is loading
  const isInitialLoading = balancesLoading && balances.length === 0;

  useEffect(() => {
    dispatch(fetchBalances());
    dispatch(fetchExpenses(currentMonth));
    dispatch(fetchIncomes(currentMonth));
    dispatch(fetchUpcomingBills(7));
    dispatch(fetchCreditCards());
  }, [dispatch, currentMonth]);

  const handleIncomeSuccess = () => {
    dispatch(fetchIncomes(currentMonth));
    dispatch(fetchBalances());
  };

  const handleExpenseSuccess = () => {
    dispatch(fetchExpenses(currentMonth));
    dispatch(fetchBalances());
    dispatch(fetchCreditCards());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your financial status</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowIncomeModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowExpenseModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Financial Month Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Financial Month: {monthName}
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Tracking period: <span className="font-medium">{monthRangeText}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Your financial month runs from the 25th to the 24th of the following month, aligned with salary dates.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      {isInitialLoading ? (
        <QuickStatsSkeleton />
      ) : (
        <QuickStats
          currentBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          monthlySurplus={monthlySurplus}
        />
      )}

      {/* Balance Cards & Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Husband's Balance Card */}
        {isInitialLoading ? (
          <BalanceCardSkeleton title="Husband's Balance" />
        ) : (
          <Card title="Husband's Balance" icon={<Wallet className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cash on Hand</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(yourBalance?.cash || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Bank Account</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(yourBalance?.bank || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Set Aside</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(yourBalance?.setAside || 0)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(husbandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Wife's Balance Card */}
        {isInitialLoading ? (
          <BalanceCardSkeleton title="Wife's Balance" />
        ) : (
          <Card title="Wife's Balance" icon={<Wallet className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cash on Hand</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(wifeBalance?.cash || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Bank Account</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(wifeBalance?.bank || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Set Aside</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(wifeBalance?.setAside || 0)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatCurrency(wifeTotal)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Bills */}
        {billsLoading && upcomingBills.length === 0 ? (
          <UpcomingBillsSkeleton />
        ) : (
          <UpcomingBillsList bills={upcomingBills} />
        )}
      </div>

      {/* Income Modal */}
      <IncomeModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSuccess={handleIncomeSuccess}
      />

      {/* Expense Modal */}
      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSuccess={handleExpenseSuccess}
      />
    </div>
  );
};