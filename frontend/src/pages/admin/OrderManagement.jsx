import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const MOCK_ORDERS = [
  {
    id: 'o1',
    orderNumber: 'SG202607120001',
    createdAt: '2026-07-12T12:00:00.000Z',
    customerSnapshot: { name: 'Dipesh Kumar', email: 'dipesh@gmail.com', phone: '9876543210' },
    items: [
      { name: 'Premium Basmati Rice', price: 120, quantity: 1, total: 120, weight: '1 kg' }
    ],
    shippingAddress: { street: '123 Park Avenue', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Placed',
    totalAmount: 160,
    shippingFee: 40,
    statusHistory: [
      { status: 'Placed', timestamp: '2026-07-12T12:00:00.000Z', remarks: 'Order placed by customer.' }
    ]
  },
  {
    id: 'o2',
    orderNumber: 'SG202607120002',
    createdAt: '2026-07-11T10:00:00.000Z',
    customerSnapshot: { name: 'Aarav Mehta', email: 'aarav@gmail.com', phone: '9999999999' },
    items: [
      { name: 'Ratnagiri Alphonso Mangoes', price: 450, quantity: 1, total: 450, weight: '1 kg' },
      { name: 'Organic Sunflower Oil', price: 180, quantity: 1, total: 180, weight: '1 L' }
    ],
    shippingAddress: { street: '456 Hill Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    totalAmount: 630,
    shippingFee: 0,
    statusHistory: [
      { status: 'Placed', timestamp: '2026-07-11T10:00:00.000Z', remarks: 'Order placed.' },
      { status: 'Confirmed', timestamp: '2026-07-11T11:00:00.000Z', remarks: 'Order confirmed.' },
      { status: 'Delivered', timestamp: '2026-07-11T15:00:00.000Z', remarks: 'Delivered by courier.' }
    ]
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Update fields
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setRemarks('');
    setIsDrawerOpen(true);
  };

  const handleStatusUpdateSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) return;

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrder.id) {
        const updatedHistory = [
          ...o.statusHistory,
          { status: newStatus, timestamp: new Date().toISOString(), remarks: remarks || `Order status updated to ${newStatus}` }
        ];
        
        let paymentStatus = o.paymentStatus;
        if (newStatus === 'Delivered' && o.paymentMethod === 'COD') {
          paymentStatus = 'Paid';
        }

        const updatedOrder = {
          ...o,
          orderStatus: newStatus,
          paymentStatus,
          statusHistory: updatedHistory
        };
        
        setSelectedOrder(updatedOrder);
        return updatedOrder;
      }
      return o;
    }));

    toast.success('Order status updated successfully!');
  };

  // Filter
  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerSnapshot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Order ID', key: 'orderNumber', className: 'font-semibold' },
    { header: 'Customer', key: 'customer', render: (row) => (
      <div className="flex flex-col text-left">
        <span className="font-semibold uppercase">{row.customerSnapshot.name}</span>
        <span className="text-[9px] text-zinc-400 font-light">{row.customerSnapshot.email}</span>
      </div>
    )},
    { header: 'Date Placed', key: 'createdAt', render: (row) => (
      <span>{new Date(row.createdAt).toLocaleDateString()}</span>
    )},
    { header: 'Total', key: 'totalAmount', render: (row) => <span>₹{row.totalAmount}</span> },
    { header: 'Payment', key: 'paymentStatus', render: (row) => (
      <StatusBadge status={row.paymentStatus} />
    )},
    { header: 'Order Status', key: 'orderStatus', render: (row) => (
      <StatusBadge status={row.orderStatus} />
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'View Details', onClick: () => handleOpenDetails(row) }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-6">
      
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search orders by ID or customer name..."
      />

      <DataTable
        columns={columns}
        data={filteredOrders}
      />

      {/* Details / Edit Status Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Order Details: ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white border border-zinc-200 p-4 space-y-2">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Customer details</span>
              <div className="text-xs space-y-1">
                <p className="font-semibold uppercase">{selectedOrder.customerSnapshot.name}</p>
                <p className="font-light text-zinc-500">{selectedOrder.customerSnapshot.email}</p>
                <p className="font-light text-zinc-500">Phone: {selectedOrder.customerSnapshot.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-zinc-200 p-4 space-y-2">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Shipping Address</span>
              <div className="text-xs space-y-1">
                <p className="font-semibold uppercase">{selectedOrder.shippingAddress.street}</p>
                <p className="font-light text-zinc-500 uppercase">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Snapshotted Items */}
            <div className="bg-white border border-zinc-200 p-4 space-y-3">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Snapshotted Items</span>
              <div className="space-y-2 divide-y divide-zinc-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pt-2 first:pt-0">
                    <div className="flex flex-col">
                      <span className="font-semibold uppercase">{item.name}</span>
                      <span className="text-[9px] text-zinc-400 font-light">{item.weight} x{item.quantity}</span>
                    </div>
                    <span className="font-semibold">₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Invoice Breakdown */}
            <div className="bg-white border border-zinc-200 p-4 text-xs space-y-2">
              <div className="flex justify-between font-light text-zinc-500">
                <span>Shipping Charges</span>
                <span>₹{selectedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Paid via {selectedOrder.paymentMethod}</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdateSubmit} className="bg-white border border-zinc-200 p-6 space-y-4">
              <h4 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                Update Order Status
              </h4>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Set Status</span>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
                >
                  <option value="Placed">Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <Input
                label="Status Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="E.G. COURIER ASSIGNED"
              />

              <Button 
                type="submit"
                className="w-full pt-3"
              >
                Apply Status Change
              </Button>
            </form>

            {/* Vertical Progress Timeline */}
            <div className="bg-white border border-zinc-200 p-6 text-left">
              <h4 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-3 mb-4">
                Order History Timeline
              </h4>
              <div className="relative border-l border-zinc-200 pl-4 ml-2 space-y-4">
                {selectedOrder.statusHistory.map((hist, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    {/* Circle icon marker */}
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-black border-2 border-white"></div>
                    <span className="text-[9px] text-zinc-400 font-light block">
                      {new Date(hist.timestamp).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase block">{hist.status}</span>
                    <span className="text-[10px] text-zinc-500 font-light leading-none">{hist.remarks}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </FormDrawer>

    </div>
  );
};

export default OrderManagement;
