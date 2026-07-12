import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder = '',
  className = '',
  icon: Icon = null,
  suffixIcon: SuffixIcon = null,
  onSuffixClick = null,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative w-full flex items-center">
        {Icon && (
          <Icon className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-10 px-4 text-xs tracking-wider rounded-none border focus:outline-none transition-colors ${
            Icon ? 'pl-9' : ''
          } ${
            SuffixIcon ? 'pr-9' : ''
          } ${
            error 
              ? 'border-red-500 focus:border-red-500 bg-red-50/10' 
              : 'border-zinc-200 focus:border-black bg-white'
          } ${
            disabled ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        />
        
        {SuffixIcon && (
          <button
            type="button"
            onClick={onSuffixClick}
            disabled={disabled}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black absolute right-1 transition-colors"
          >
            <SuffixIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {error && (
        <span className="text-[9px] tracking-wider text-red-500 font-light mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
