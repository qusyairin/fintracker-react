import React from 'react';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ExpensesPage } from '../features/expenses/ExpensesPage';
import { IncomePage } from '../features/income/IncomePage';
import { CreditCardsPage } from '../features/creditCards/CreditCardsPage';
import { BillsPage } from '../features/bills/BillsPage';
import { BalancePage } from '../features/balance/BalancePage';
import { ReservedPage } from '../features/reserved/ReservedPage';
import { TabungPage } from '../features/tabung/TabungPage';

export type RouteKey = 'dashboard' | 'expenses' | 'income' | 'balance' | 'credit-cards' | 'bills' | 'budget' | 'reports' | 'settings' | 'reserved' | 'tabung';

interface Route {
  path: string;
  component: React.ComponentType;
  label: string;
}

export const routes: Record<RouteKey, Route> = {
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    label: 'Dashboard',
  },
  expenses: {
    path: '/expenses',
    component: ExpensesPage,
    label: 'Expenses',
  },
  income: {
    path: '/income',
    component: IncomePage,
    label: 'Income',
  },
  reserved: {
    path: '/reserved',
    component: ReservedPage,
    label: 'Reserved',
  },
  balance: {
    path: '/balance',
    component: BalancePage,
    label: 'Balance',
  },
  'credit-cards': {
    path: '/credit-cards',
    component: CreditCardsPage,
    label: 'Credit Cards',
  },
  bills: {
    path: '/bills',
    component: BillsPage,
    label: 'Bills',
  },
  budget: {
    path: '/budget',
    component: () => <div className="text-center py-12 text-gray-600">Budget page coming soon</div>,
    label: 'Budget',
  },
  reports: {
    path: '/reports',
    component: () => <div className="text-center py-12 text-gray-600">Reports page coming soon</div>,
    label: 'Reports',
  },
  settings: {
    path: '/settings',
    component: () => <div className="text-center py-12 text-gray-600">Settings page coming soon</div>,
    label: 'Settings',
  },
  tabung: {
    path: '/tabung',
    component: TabungPage,
    label: 'Tabung',
  },
};

export const getRouteComponent = (path: string): React.ComponentType | null => {
  const route = Object.values(routes).find((r) => r.path === path);
  return route ? route.component : null;
};