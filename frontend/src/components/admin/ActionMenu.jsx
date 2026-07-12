import React, { useState, useRef, useEffect } from 'react';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const ActionMenu = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left z-10">
      
      {/* Menu Toggle Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-zinc-200 bg-white hover:border-black text-zinc-500 hover:text-black transition-colors"
      >
        <IoEllipsisHorizontalOutline className="w-4 h-4" />
      </button>

      {/* Action Overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-1 w-32 bg-white border border-zinc-200 shadow-xl py-1 focus:outline-none"
          >
            {actions.map((act) => (
              <button
                key={act.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  if (act.onClick) act.onClick();
                }}
                className={`w-full text-left px-4 py-2 text-[10px] tracking-wider uppercase font-light transition-colors hover:bg-zinc-50 ${
                  act.danger ? 'text-red-500 hover:text-red-700 hover:bg-red-50/10' : 'text-zinc-700 hover:text-black'
                }`}
              >
                {act.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ActionMenu;
