import React, { useEffect, useState } from 'react';
import { Plus, Wallet, Info, ChevronDown, ChevronUp, PiggyBank } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchExpenses } from '../expenses/expenseSlice';
import { fetchIncomes } from '../income/incomeSlice';
import { fetchUpcomingBills } from '../bills/billSlice';
import { fetchCreditCards } from '../creditCards/creditCardSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { fetchReservedItems } from '../reserved/reservedSlice';
import { fetchTabung } from '../tabung/tabungSlice';
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
  const { items: reservedItems } = useAppSelector((state) => state.reserved);
  const { items: tabungItems } = useAppSelector((state) => state.tabung);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expandedBalances, setExpandedBalances] = useState({
    husband: true,
    wife: true
  });

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

  // Get reserved items per user
  const husbandReserved = reservedItems.filter((item) => item.user === 'husband');
  const wifeReserved = reservedItems.filter((item) => item.user === 'wife');

  // Get tabung items per user (for separate display)
  const husbandTabung = tabungItems.filter((item) => item.user === 'husband');
  const wifeTabung = tabungItems.filter((item) => item.user === 'wife');

  // Calculate tabung totals (SEPARATE from current balance)
  const husbandTabungTotal = husbandTabung.reduce((sum, item) => sum + item.savedAmount, 0);
  const wifeTabungTotal = wifeTabung.reduce((sum, item) => sum + item.savedAmount, 0);

  // Calculate current balance totals (WITHOUT tabung)
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
    dispatch(fetchReservedItems());
    dispatch(fetchTabung());
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

  const toggleBalanceExpand = (user: 'husband' | 'wife') => {
    setExpandedBalances(prev => ({
      ...prev,
      [user]: !prev[user]
    }));
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
          <Card 
            title={
              <button
                onClick={() => toggleBalanceExpand('husband')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span>Husband's Balance</span>
                </div>
                {expandedBalances.husband ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
            }
          >
            <div className="space-y-4">
              {/* Total (Always Visible) */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(husbandTotal)}
                  </span>
                </div>
              </div>

              {/* Breakdown (Collapsible) */}
              {expandedBalances.husband && (
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Wallet</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(yourBalance?.cash || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Bank Balance</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(yourBalance?.bank || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Reserved</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(yourBalance?.setAside || 0)}
                    </span>
                  </div>

                  {/* Reserved Items Breakdown */}
                  {husbandReserved.length > 0 && (
                    <div className="mt-3 pl-4 space-y-1">
                      <p className="text-xs font-medium text-gray-500 mb-2">Reserved Items:</p>
                      {husbandReserved.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1">
                          <span className="text-xs text-gray-600">• {item.purpose}</span>
                          <span className="text-xs font-medium text-gray-700">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Wife's Balance Card */}
        {isInitialLoading ? (
          <BalanceCardSkeleton title="Wife's Balance" />
        ) : (
          <Card 
            title={
              <button
                onClick={() => toggleBalanceExpand('wife')}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span>Wife's Balance</span>
                </div>
                {expandedBalances.wife ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
            }
          >
            <div className="space-y-4">
              {/* Total (Always Visible) */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatCurrency(wifeTotal)}
                  </span>
                </div>
              </div>

              {/* Breakdown (Collapsible) */}
              {expandedBalances.wife && (
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Wallet</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(wifeBalance?.cash || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Bank Balance</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(wifeBalance?.bank || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Reserved</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(wifeBalance?.setAside || 0)}
                    </span>
                  </div>

                  {/* Reserved Items Breakdown */}
                  {wifeReserved.length > 0 && (
                    <div className="mt-3 pl-4 space-y-1">
                      <p className="text-xs font-medium text-gray-500 mb-2">Reserved Items:</p>
                      {wifeReserved.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1">
                          <span className="text-xs text-gray-600">• {item.purpose}</span>
                          <span className="text-xs font-medium text-gray-700">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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

      {/* Tabung Summary (Separate Section) */}
      {(husbandTabung.length > 0 || wifeTabung.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Husband's Tabung */}
          {husbandTabung.length > 0 && (
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Husband's Tabung</h3>
                      <p className="text-xs text-gray-500">Savings Goals</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(husbandTabungTotal)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  {husbandTabung.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.progressPercentage || 0}% of {formatCurrency(item.targetAmount)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 ml-3">
                        {formatCurrency(item.savedAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Wife's Tabung */}
          {wifeTabung.length > 0 && (
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PiggyBank className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Wife's Tabung</h3>
                      <p className="text-xs text-gray-500">Savings Goals</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {formatCurrency(wifeTabungTotal)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  {wifeTabung.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.progressPercentage || 0}% of {formatCurrency(item.targetAmount)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 ml-3">
                        {formatCurrency(item.savedAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

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