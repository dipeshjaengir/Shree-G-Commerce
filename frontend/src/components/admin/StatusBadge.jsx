import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const normalized = status?.toLowerCase() || '';

  const styles = {
    // Orders
    placed: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    confirmed: 'bg-zinc-900 text-white border-black',
    packed: 'bg-zinc-500 text-white border-zinc-500',
    'out for delivery': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    returned: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    
    // Customers / Accounts
    active: 'bg-green-50 text-green-700 border-green-200',
    blocked: 'bg-red-50 text-red-600 border-red-200',
    
    // Payments
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-600 border-red-200',
    refunded: 'bg-zinc-100 text-zinc-800 border-zinc-200'
  };

  const styleClass = styles[normalized] || 'bg-zinc-100 text-zinc-600 border-zinc-200';

  return (
    <span className={`inline-flex items-center justify-center text-[9px] tracking-[0.1em] font-semibold px-2.5 py-0.5 rounded-full border uppercase select-none ${styleClass} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
