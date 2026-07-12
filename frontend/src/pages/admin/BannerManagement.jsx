import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import FileUploader from '../../components/admin/FileUploader.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { toast } from 'react-hot-toast';

const MOCK_BANNERS = [
  { id: '1', name: 'Fresh Fruits Promo Hero', type: 'Hero', sortOrder: 1, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', isActive: true },
  { id: '2', name: 'Weekend Organic Essentials', type: 'Promo', sortOrder: 2, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', isActive: true }
];

const BannerManagement = () => {
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState('Hero');
  const [sortOrder, setSortOrder] = useState('1');

  const handleOpenCreate = () => {
    setName('');
    setType('Hero');
    setSortOrder('1');
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newBanner = {
      id: `b_${Date.now()}`,
      name, type, sortOrder: Number(sortOrder),
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
      isActive: true
    };
    setBanners(prev => [newBanner, ...prev]);
    setIsDrawerOpen(false);
    toast.success('Promo banner uploaded successfully.');
  };

  const handleToggleStatus = (banner) => {
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
    toast.success(`Banner status updated.`);
  };

  const handleOpenDelete = (banner) => {
    setBannerToDelete(banner);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setBanners(prev => prev.filter(b => b.id !== bannerToDelete.id));
    setIsConfirmOpen(false);
    toast.success('Banner deleted.');
  };

  const filteredBanners = banners.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Preview', key: 'image', render: (row) => (
      <div className="w-16 h-10 border border-zinc-200 bg-zinc-50 shrink-0 p-1 flex items-center justify-center overflow-hidden">
        <img src={row.image} alt="" className="w-full h-full object-cover grayscale" />
      </div>
    )},
    { header: 'Banner Title', key: 'name', sortable: true, className: 'font-semibold uppercase' },
    { header: 'Type / Group', key: 'type', render: (row) => <span className="uppercase text-[9px]">{row.type}</span> },
    { header: 'Sort Order', key: 'sortOrder', sortable: true },
    { header: 'Status', key: 'isActive', render: (row) => (
      <StatusBadge status={row.isActive ? 'Active' : 'Blocked'} />
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: row.isActive ? 'Disable Visibility' : 'Enable Visibility', onClick: () => handleToggleStatus(row) },
          { label: 'Delete Banner', onClick: () => handleOpenDelete(row), danger: true }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-6">
      
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search banners by label..."
        onCreateClick={handleOpenCreate}
        createLabel="Upload Banner"
      />

      <DataTable
        columns={columns}
        data={filteredBanners}
      />

      {/* Form Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Upload Promo Banner"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Banner Descriptive Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.G. DIWALI MONSOON BANNER"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Banner Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
              >
                <option value="Hero">Homepage Hero Banner</option>
                <option value="Promo">Promo Sidebar Banner</option>
                <option value="Deals">Deals of the Day Group</option>
              </select>
            </div>

            <Input
              label="Sort Priority"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="SORT ORDER"
            />
          </div>

          <FileUploader 
            label="Upload Image File"
            onChange={(file) => console.log('Banner image uploaded:', file)}
          />

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            Upload Banner
          </Button>
        </form>
      </FormDrawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Banner"
        message={`Are you sure you want to delete this promotional banner? It will immediately stop rendering on the storefront.`}
      />

    </div>
  );
};

export default BannerManagement;
