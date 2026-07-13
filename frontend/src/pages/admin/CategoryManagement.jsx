import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import FileUploader from '../../components/admin/FileUploader.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { MOCK_CATEGORIES } from '../../utils/mockData.js';
import { toast } from 'react-hot-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [module, setModule] = useState('grocery');
  const [description, setDescription] = useState('');

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setName('');
    setSlug('');
    setModule('grocery');
    setDescription('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.id); // in mock data cat.id is used as slug
    setModule('grocery'); // default
    setDescription('');
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error('Name and slug are required.');
      return;
    }

    if (selectedCategory) {
      // Edit
      setCategories(prev => prev.map(c => c.id === selectedCategory.id ? {
        ...c, name, id: slug
      } : c));
      toast.success('Category updated successfully.');
    } else {
      // Create
      const newCat = {
        id: slug.toLowerCase().replace(/\s+/g, '-'),
        name,
        itemsCount: '0 Items',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'
      };
      setCategories(prev => [newCat, ...prev]);
      toast.success('Category created successfully.');
    }
    setIsDrawerOpen(false);
  };

  const handleOpenDelete = (cat) => {
    setCatToDelete(cat);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setCategories(prev => prev.filter(c => c.id !== catToDelete.id));
    setIsConfirmOpen(false);
    toast.success('Category soft-deleted.');
  };

  // Filter
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Slug/ID', key: 'id', className: 'font-semibold font-mono text-[10px]' },
    { header: 'Category Name', key: 'name', sortable: true, render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 shrink-0 p-1 flex items-center justify-center">
          <img src={row.image} alt="" className="w-full h-full object-cover" />
        </div>
        <span className="font-semibold uppercase">{row.name}</span>
      </div>
    )},
    { header: 'Attached Items', key: 'itemsCount' },
    { header: 'Module', key: 'module', render: () => <span className="uppercase text-[9px] font-semibold bg-zinc-100 px-2 py-0.5">Grocery</span> },
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'Edit', onClick: () => handleOpenEdit(row) },
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
        searchPlaceholder="Search categories by name or slug..."
        onCreateClick={handleOpenCreate}
        createLabel="Add Category"
      />

      <DataTable
        columns={columns}
        data={filteredCategories}
      />

      {/* Form Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!selectedCategory) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }
            }}
            placeholder="E.G. FRESH VEGETABLES"
            required
          />

          <Input
            label="Category Slug (URL Path)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="SLUG"
            required
          />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Module Scope</span>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
            >
              <option value="grocery">Grocery (Mart)</option>
              <option value="clothing">Clothing (Collection)</option>
            </select>
          </div>

          <FileUploader 
            label="Category Banner Image"
            onChange={(file) => console.log('Category logo:', file)}
          />

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            {selectedCategory ? 'Save Changes' : 'Create Category'}
          </Button>
        </form>
      </FormDrawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${catToDelete?.name}"? Items attached to this category must be reassigned.`}
      />

    </div>
  );
};

export default CategoryManagement;
