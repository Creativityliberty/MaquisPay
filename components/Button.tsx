import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "py-4 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700",
    secondary: "bg-white text-violet-900 shadow-md hover:bg-violet-50",
    danger: "bg-red-100 text-red-600 hover:bg-red-200",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};