import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Archive,
  ChevronDown,
  ChevronRight,
  PiggyBank,
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

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentRoute, onNavigate }) => {
  const navSections: NavSection[] = [
    {
      id: 'overview',
      title: 'OVERVIEW',
      items: [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', route: 'dashboard' },
      ],
    },
    {
      id: 'money-in',
      title: 'MONEY IN',
      items: [
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Income', route: 'income' },
      ],
    },
    {
      id: 'money-out',
      title: 'MONEY OUT',
      items: [
        { icon: <TrendingDown className="w-5 h-5" />, label: 'Expenses', route: 'expenses' },
        { icon: <Receipt className="w-5 h-5" />, label: 'Bills & Payments', route: 'bills' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Credit Cards', route: 'credit-cards' },
      ],
    },
    {
      id: 'accounts',
      title: 'ACCOUNTS',
      items: [
        { icon: <Wallet className="w-5 h-5" />, label: 'Balance', route: 'balance' },
        { icon: <Archive className="w-5 h-5" />, label: 'Reserved', route: 'reserved' },
        { icon: <PiggyBank className="w-5 h-5" />, label: 'Tabung', route: 'tabung' },
      ],
    },
  ];

  // Helper function to find which section contains the current route
  const getSectionByRoute = (route: RouteKey): string | null => {
    for (const section of navSections) {
      if (section.items.some((item) => item.route === route)) {
        return section.id;
      }
    }
    return null;
  };

  // Initialize with only the current route's section expanded
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const currentSection = getSectionByRoute(currentRoute);
    return currentSection ? [currentSection] : [];
  });

  // Auto-expand section when route changes
  useEffect(() => {
    const currentSection = getSectionByRoute(currentRoute);
    if (currentSection && !expandedSections.includes(currentSection)) {
      setExpandedSections((prev) => [...prev, currentSection]);
    }
  }, [currentRoute]);

  if (!isOpen) return null;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

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

      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 overflow-y-auto">
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

        <nav className="p-4">
          {navSections.map((section, sectionIndex) => (
            <div key={section.id} className={sectionIndex > 0 ? 'mt-6' : ''}>
              {/* Section Header - Clickable */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                {isSectionExpanded(section.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Section Items - Collapsible */}
              {isSectionExpanded(section.id) && (
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => (
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
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};