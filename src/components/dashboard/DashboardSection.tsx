import React, { ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  title, 
  icon, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-100 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;