import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBar = ({
  show = false,
  children,
  onReset,
  className = ''
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className={`border border-zinc-200 border-t-0 bg-white p-4 flex flex-wrap items-end justify-between gap-4 ${className}`}>
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {children}
            </div>

            {onReset && (
              <button
                onClick={onReset}
                className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-semibold border-b border-zinc-200 hover:border-black transition-all pb-0.5 shrink-0"
              >
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterBar;
