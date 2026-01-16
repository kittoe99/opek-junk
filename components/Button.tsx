import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'inverse' | 'outline-inverse';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Standard Light Theme Buttons
    primary: "bg-black text-white hover:bg-gray-800 border border-transparent shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-black hover:bg-gray-200 border border-transparent",
    outline: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white",
    
    // Dark Background Buttons (Hero, Footer, etc)
    inverse: "bg-white text-black hover:bg-gray-100 border border-transparent shadow-lg hover:shadow-xl",
    "outline-inverse": "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};