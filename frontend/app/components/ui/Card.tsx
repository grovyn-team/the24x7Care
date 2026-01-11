import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, style }) => {
  // Check if dark background is already specified in className
  const hasDarkBg = className.includes('bg-teal-800') || className.includes('bg-teal-700') || className.includes('bg-teal-900');
  const baseClasses = hasDarkBg 
    ? 'rounded-xl shadow-sm p-6 border transition-all duration-200'
    : 'bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200';
  const hoverClasses = hover ? (hasDarkBg ? 'hover:shadow-md hover:border-teal-600' : 'hover:shadow-md hover:border-teal-200') : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} style={style}>
      {children}
    </div>
  );
};
