import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';

const FormDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`w-full max-w-lg bg-[#F8F8F8] text-black shadow-2xl relative z-10 flex flex-col h-full overflow-hidden border-l border-zinc-200 ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-200 bg-white shrink-0">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
                {title || 'Form Action'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all animate-pulse"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 text-left">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FormDrawer;
