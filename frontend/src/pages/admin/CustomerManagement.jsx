import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { toast } from 'react-hot-toast';

const MOCK_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Dipesh Kumar',
    email: 'dipesh@gmail.com',
    phone: '9876543210',
    totalSpending: 160,
    totalOrders: 1,
    registrationDate: '2026-07-12T06:00:00.000Z',
    status: 'Active',
    addresses: [
      { street: '123 Park Avenue', city: 'Mumbai', state: 'Maharashtra', zip: '400001' }
    ]
  },
  {
    id: 'c2',
    name: 'Aarav Mehta',
    email: 'aarav@gmail.com',
    phone: '9999999999',
    totalSpending: 630,
    totalOrders: 1,
    registrationDate: '2026-07-11T09:00:00.000Z',
    status: 'Active',
    addresses: [
      { street: '456 Hill Road', city: 'Pune', state: 'Maharashtra', zip: '411001' }
    ]
  }
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleToggleBlockStatus = (cust) => {
    const nextStatus = cust.status === 'Active' ? 'Blocked' : 'Active';
    setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, status: nextStatus } : c));
    toast.success(`Customer account is now ${nextStatus}.`);
  };

  const handleOpenDetails = (cust) => {
    setSelectedCustomer(cust);
    setIsDrawerOpen(true);
  };

  // Filter
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Customer Name', key: 'name', sortable: true, render: (row) => (
      <div className="flex flex-col text-left">
        <span className="font-semibold uppercase">{row.name}</span>
        <span className="text-[9px] text-zinc-400 font-light">{row.phone}</span>
      </div>
    )},
    { header: 'Email Address', key: 'email', sortable: true },
    { header: 'Spending', key: 'totalSpending', sortable: true, render: (row) => <span>₹{row.totalSpending}</span> },
    { header: 'Orders Placed', key: 'totalOrders', sortable: true },
    { header: 'Joined Date', key: 'registrationDate', render: (row) => (
      <span>{new Date(row.registrationDate).toLocaleDateString()}</span>
    )},
    { header: 'Account Status', key: 'status', render: (row) => (
      <StatusBadge status={row.status} />
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'View Profile details', onClick: () => handleOpenDetails(row) },
          { 
            label: row.status === 'Active' ? 'Block Account' : 'Unblock Account', 
            onClick: () => handleToggleBlockStatus(row),
            danger: row.status === 'Active'
          }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-6">
      
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search customers by name or email..."
      />

      <DataTable
        columns={columns}
        data={filteredCustomers}
      />

      {/* Customer Details Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Customer logs: ${selectedCustomer?.name}`}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            
            {/* Identity card */}
            <div className="bg-white border border-zinc-200 p-4 text-xs space-y-1">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Account status</span>
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold">{selectedCustomer.email}</span>
                <StatusBadge status={selectedCustomer.status} />
              </div>
            </div>

            {/* Address Snapshot list */}
            <div className="bg-white border border-zinc-200 p-4 space-y-3">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Addresses ({selectedCustomer.addresses.length})</span>
              <div className="space-y-2">
                {selectedCustomer.addresses.map((addr, idx) => (
                  <div key={idx} className="text-xs space-y-0.5 border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold uppercase block">{addr.street}</span>
                    <span className="font-light text-zinc-400 uppercase block">{addr.city}, {addr.state}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spent summary */}
            <div className="bg-white border border-zinc-200 p-4 text-xs space-y-2">
              <div className="flex justify-between font-light text-zinc-500">
                <span>Total Orders</span>
                <span>{selectedCustomer.totalOrders} Placed</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Lifetime Spending</span>
                <span>₹{selectedCustomer.totalSpending}</span>
              </div>
            </div>

          </div>
        )}
      </FormDrawer>

    </div>
  );
};

export default CustomerManagement;
