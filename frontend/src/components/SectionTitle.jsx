import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({
  title,
  subtitle,
  actionLabel,
  onActionClick,
  className = ''
}) => {
  return (
    <div className={`flex items-end justify-between border-b border-zinc-200 pb-3 mb-6 ${className}`}>
      <div className="space-y-1">
        {subtitle && (
          <span className="text-[9px] tracking-[0.4em] text-zinc-400 uppercase font-light block">
            {subtitle}
          </span>
        )}
        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-black">
          {title}
        </h2>
      </div>
      
      {actionLabel && onActionClick && (
        <motion.button
          onClick={onActionClick}
          whileHover={{ x: 2 }}
          className="text-[9px] tracking-[0.15em] font-light text-zinc-400 hover:text-black transition-colors uppercase cursor-pointer"
        >
          {actionLabel}
        </motion.button>
      )}
    </div>
  );
};

export default SectionTitle;
