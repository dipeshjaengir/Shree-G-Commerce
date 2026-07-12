import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import Button from './Button.jsx';

const EmptyState = ({
  title = 'No Records Found',
  description = 'We could not find anything matching your description.',
  icon: Icon = IoWarningOutline,
  actionLabel,
  onActionClick
}) => {
  return (
    <div className="bg-white border border-zinc-200 p-12 text-center flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-black">{title}</h3>
        <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && onActionClick && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onActionClick}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
