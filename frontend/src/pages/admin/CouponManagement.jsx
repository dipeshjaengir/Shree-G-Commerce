import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { toast } from 'react-hot-toast';

const MOCK_COUPONS = [
  { id: '1', code: 'WELCOME50', type: 'flat', value: 50, minPurchase: 300, maxDiscount: 50, expiryDate: '2026-12-31', isActive: true, usageLimit: 100 },
  { id: '2', code: 'FESTIVE20', type: 'percentage', value: 20, minPurchase: 500, maxDiscount: 150, expiryDate: '2026-08-31', isActive: true, usageLimit: 200 }
];

const CouponManagement = () => {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // Form States
  const [code, setCode] = useState('');
  const [type, setType] = useState('flat');
  const [value, setValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleOpenCreate = () => {
    setSelectedCoupon(null);
    setCode('');
    setType('flat');
    setValue('');
    setMinPurchase('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCoupon(c);
    setCode(c.code);
    setType(c.type);
    setValue(c.value);
    setMinPurchase(c.minPurchase);
    setMaxDiscount(c.maxDiscount);
    setExpiryDate(c.expiryDate);
    setUsageLimit(c.usageLimit);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!code || !value) {
      toast.error('Code and value are required.');
      return;
    }

    if (selectedCoupon) {
      setCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? {
        ...c, code: code.toUpperCase(), type, value: Number(value), minPurchase: Number(minPurchase), maxDiscount: Number(maxDiscount), expiryDate, usageLimit: Number(usageLimit)
      } : c));
      toast.success('Coupon updated successfully.');
    } else {
      const newCoupon = {
        id: `c_${Date.now()}`,
        code: code.toUpperCase(), type, value: Number(value), minPurchase: Number(minPurchase), maxDiscount: Number(maxDiscount), expiryDate, usageLimit: Number(usageLimit),
        isActive: true
      };
      setCoupons(prev => [newCoupon, ...prev]);
      toast.success('Coupon created successfully.');
    }
    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (coupon) => {
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
    toast.success(`Coupon ${coupon.code} status updated.`);
  };

  const handleOpenDelete = (coupon) => {
    setCouponToDelete(coupon);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setCoupons(prev => prev.filter(c => c.id !== couponToDelete.id));
    setIsConfirmOpen(false);
    toast.success('Coupon deleted.');
  };

  // Filter
  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Code', key: 'code', sortable: true, className: 'font-semibold font-mono tracking-widest' },
    { header: 'Type', key: 'type', render: (row) => <span className="uppercase text-[9px]">{row.type}</span> },
    { header: 'Value', key: 'value', sortable: true, render: (row) => <span>{row.type === 'flat' ? `₹${row.value}` : `${row.value}%`}</span> },
    { header: 'Min Purchase', key: 'minPurchase', render: (row) => <span>₹{row.minPurchase}</span> },
    { header: 'Max Discount', key: 'maxDiscount', render: (row) => <span>₹{row.maxDiscount}</span> },
    { header: 'Expiry Date', key: 'expiryDate', render: (row) => <span>{row.expiryDate}</span> },
    { header: 'Status', key: 'isActive', render: (row) => (
      <StatusBadge status={row.isActive ? 'Active' : 'Blocked'} />
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'Edit Coupon', onClick: () => handleOpenEdit(row) },
          { label: row.isActive ? 'Disable' : 'Enable', onClick: () => handleToggleStatus(row) },
          { label: 'Delete', onClick: () => handleOpenDelete(row), danger: true }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-6">
      
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search coupons by code..."
        onCreateClick={handleOpenCreate}
        createLabel="Create Coupon"
      />

      <DataTable
        columns={columns}
        data={filteredCoupons}
      />

      {/* Form Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="E.G. RAMADAN50"
            required
          />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Discount Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
            >
              <option value="flat">Flat Cash Discount (INR)</option>
              <option value="percentage">Percentage Discount (%)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="VALUE"
              required
            />
            <Input
              label="Min Order Amount"
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              placeholder="MIN ORDER"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Max Discount"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              placeholder="MAX CAP"
            />
            <Input
              label="Usage Limit"
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="QTY LIMIT"
            />
            <Input
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            {selectedCoupon ? 'Save Coupon' : 'Create Coupon'}
          </Button>
        </form>
      </FormDrawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon code "${couponToDelete?.code}"? Existing orders will not be affected.`}
      />

    </div>
  );
};

export default CouponManagement;
