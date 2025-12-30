import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PieChart,
  FileText,
  Settings,
  X,
} from 'lucide-react';
import { RouteKey, routes } from '../../routes/Router';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  route: RouteKey;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentRoute, onNavigate }) => {
  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', route: 'dashboard' },
    { icon: <TrendingDown className="w-5 h-5" />, label: 'Expenses', route: 'expenses' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Income', route: 'income' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Balance', route: 'balance' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Credit Cards', route: 'credit-cards' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Bills', route: 'bills' },
    // { icon: <PieChart className="w-5 h-5" />, label: 'Budget', route: 'budget' },
    // { icon: <FileText className="w-5 h-5" />, label: 'Reports', route: 'reports' },
    // { icon: <Settings className="w-5 h-5" />, label: 'Settings', route: 'settings' },
  ];

  if (!isOpen) return null;

  const handleNavigation = (route: RouteKey) => {
    onNavigate(route);
    window.history.pushState({}, '', routes[route].path);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onToggle}
      />

      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinTracker</h1>
              <p className="text-xs text-gray-500">Personal Finance</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentRoute === item.route
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};