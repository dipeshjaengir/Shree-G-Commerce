import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoWarningOutline, IoCloseOutline } from 'react-icons/io5';
import Button from '../Button.jsx';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger', // danger, warning, info
  isLoading = false
}) => {
  const colorMap = {
    danger: 'text-red-500 bg-red-50 border-red-100',
    warning: 'text-yellow-500 bg-yellow-50 border-yellow-100',
    info: 'text-black bg-zinc-50 border-zinc-100'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white border border-zinc-200 shadow-2xl p-6 relative z-10 space-y-4"
          >
            {/* Header info */}
            <div className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${colorMap[type]}`}>
                <IoWarningOutline className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left flex-1">
                <h3 className="text-xs font-semibold tracking-widest text-black uppercase">{title}</h3>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">{message}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-black transition-colors"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
