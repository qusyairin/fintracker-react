import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RouteKey } from '../../routes/Router';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentRoute, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentRoute={currentRoute}
        onNavigate={onNavigate}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};