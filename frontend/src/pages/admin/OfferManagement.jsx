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

const MOCK_OFFERS = [
  { id: '1', name: 'Monsoon Flash Sale', discountRate: 25, startDate: '2026-07-10', endDate: '2026-07-15', isActive: true },
  { id: '2', name: 'Rakhi Festival Special', discountRate: 15, startDate: '2026-08-15', endDate: '2026-08-20', isActive: false }
];

const OfferManagement = () => {
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpenCreate = () => {
    setSelectedOffer(null);
    setName('');
    setDiscountRate('');
    setStartDate('');
    setEndDate('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (o) => {
    setSelectedOffer(o);
    setName(o.name);
    setDiscountRate(o.discountRate);
    setStartDate(o.startDate);
    setEndDate(o.endDate);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !discountRate) return;

    if (selectedOffer) {
      setOffers(prev => prev.map(o => o.id === selectedOffer.id ? {
        ...o, name, discountRate: Number(discountRate), startDate, endDate
      } : o));
      toast.success('Offer updated successfully.');
    } else {
      const newOffer = {
        id: `o_${Date.now()}`,
        name, discountRate: Number(discountRate), startDate, endDate,
        isActive: true
      };
      setOffers(prev => [newOffer, ...prev]);
      toast.success('Offer scheduled successfully.');
    }
    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (offer) => {
    setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, isActive: !o.isActive } : o));
    toast.success(`Offer status toggled.`);
  };

  const handleOpenDelete = (offer) => {
    setOfferToDelete(offer);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setOffers(prev => prev.filter(o => o.id !== offerToDelete.id));
    setIsConfirmOpen(false);
    toast.success('Offer deleted.');
  };

  const filteredOffers = offers.filter(o =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Offer Name', key: 'name', sortable: true, className: 'font-semibold' },
    { header: 'Discount Rate', key: 'discountRate', sortable: true, render: (row) => <span>{row.discountRate}% OFF</span> },
    { header: 'Starts', key: 'startDate' },
    { header: 'Ends', key: 'endDate' },
    { header: 'Status', key: 'isActive', render: (row) => (
      <StatusBadge status={row.isActive ? 'Active' : 'Blocked'} />
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'Edit Offer', onClick: () => handleOpenEdit(row) },
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
        searchPlaceholder="Search active offers by name..."
        onCreateClick={handleOpenCreate}
        createLabel="Add Offer"
      />

      <DataTable
        columns={columns}
        data={filteredOffers}
      />

      {/* Form Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOffer ? 'Edit Offer' : 'Add Offer'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Offer / Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.G. DIWALI SPECIAL DEALS"
            required
          />

          <Input
            label="Discount rate (%)"
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            placeholder="DISCOUNT RATE"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            {selectedOffer ? 'Save Offer' : 'Create Offer'}
          </Button>
        </form>
      </FormDrawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Offer"
        message={`Are you sure you want to delete "${offerToDelete?.name}"? Associated dynamic product discount tags will revert.`}
      />

    </div>
  );
};

export default OfferManagement;
