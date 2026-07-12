import React from 'react';

const Badge = ({
  children,
  variant = 'default', // default, dark, danger, warning, success, outline
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center text-[8px] tracking-[0.15em] font-semibold px-2 py-0.5 uppercase select-none';
  
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-800',
    dark: 'bg-black text-white',
    danger: 'bg-red-50 text-red-600 border border-red-200', // subtle red for offers/out-of-stock
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    outline: 'bg-transparent text-black border border-black'
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
