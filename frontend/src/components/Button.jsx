import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, text
  size = 'md', // sm, md, lg
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left', // left, right
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-light tracking-widest transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[9px]',
    md: 'px-6 py-2.5 text-[10px]',
    lg: 'px-8 py-3.5 text-xs'
  };

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-zinc-800 border border-black',
    secondary: 'bg-white text-black hover:bg-zinc-50 border border-zinc-200',
    outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
    text: 'bg-transparent text-black border-none px-0 py-1 premium-btn-hover hover:text-zinc-500'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}

      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="w-3.5 h-3.5 mr-2 shrink-0" />
      )}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-3.5 h-3.5 ml-2 shrink-0" />
      )}
    </motion.button>
  );
};

export default Button;
