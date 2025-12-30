import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, actions }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          {title && (
            <div className="flex items-center space-x-2">
              {icon && <div className="text-gray-600">{icon}</div>}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};