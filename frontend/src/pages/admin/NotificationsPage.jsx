import React, { useState } from 'react';
import { IoAlertCircleOutline, IoReceiptOutline, IoCloseCircleOutline, IoPersonAddOutline, IoCheckmarkDoneOutline } from 'react-icons/io5';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'low_stock', title: 'Low Stock Alert', message: 'Premium Basmati Rice stock is below threshold limit (3 units left).', timestamp: '5 mins ago', read: false },
  { id: '2', type: 'new_order', title: 'New Order Placed', message: 'Order SG202607120001 has been booked by customer Dipesh Kumar.', timestamp: '1 hour ago', read: false },
  { id: '3', type: 'order_cancelled', title: 'Order Cancelled Alert', message: 'Order SG202607120002 has been cancelled by Aarav Mehta.', timestamp: '2 hours ago', read: true },
  { id: '4', type: 'customer_reg', title: 'New Customer Registered', message: 'Customer Aarav Mehta created a new account on Shree G Mart.', timestamp: '1 day ago', read: true }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All alerts marked as read.');
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'low_stock':
        return <IoAlertCircleOutline className="w-5 h-5 text-red-500" />;
      case 'new_order':
        return <IoReceiptOutline className="w-5 h-5 text-black" />;
      case 'order_cancelled':
        return <IoCloseCircleOutline className="w-5 h-5 text-zinc-400" />;
      case 'customer_reg':
        return <IoPersonAddOutline className="w-5 h-5 text-green-600" />;
      default:
        return <IoAlertCircleOutline className="w-5 h-5 text-zinc-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      
      {/* Header action */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase">System Alerts Log</h2>
          <span className="text-[10px] text-zinc-400 font-light tracking-wider mt-1 block">
            {unreadCount} unread system notifications
          </span>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            icon={IoCheckmarkDoneOutline}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Alert list cards */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleMarkRead(notif.id)}
            className={`p-4 border transition-all cursor-pointer flex gap-4 items-start ${
              notif.read 
                ? 'bg-white border-zinc-200' 
                : 'bg-zinc-50 border-black shadow-sm'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold uppercase tracking-wider">{notif.title}</span>
                <span className="text-[9px] text-zinc-400 font-light">{notif.timestamp}</span>
              </div>
              <p className="font-light text-zinc-500 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationsPage;
