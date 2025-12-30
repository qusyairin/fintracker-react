import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  icon,
  actions,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {(title || icon || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            {typeof title === 'string' ? (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            ) : (
              <div className="text-lg font-semibold text-gray-900 w-full">{title}</div>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};