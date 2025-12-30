import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { pendingExpenses } = useAppSelector((state) => state.expense);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Welcome back, {user?.name}</h2>
            <p className="text-sm text-gray-500">Track your finances effortlessly</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-6 h-6" />
            {pendingExpenses.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingExpenses.length}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
