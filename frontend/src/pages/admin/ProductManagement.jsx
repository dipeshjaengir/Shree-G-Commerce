import React, { useState, useEffect } from 'react';
import { IoAddOutline, IoTrashOutline, IoCreateOutline, IoEyeOutline } from 'react-icons/io5';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import FileUploader from '../../components/admin/FileUploader.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../utils/mockData.js';
import { toast } from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setName('');
    setSku(`GRC-${Math.random().toString(36).substring(3, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setBrand('');
    setPrice('');
    setMrp('');
    setStock('');
    setUnit('1 kg');
    setCategory(MOCK_CATEGORIES[0]?.id || '');
    setDescription('');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setSku(product.sku);
    setBrand(product.brand);
    setPrice(product.price);
    setMrp(product.mrp);
    setStock(product.stock);
    setUnit(product.unit);
    setCategory(product.category);
    setDescription(product.description);
    setIsFeatured(product.isFeatured);
    setIsBestSeller(product.isBestSeller);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !sku) {
      toast.error('Please fill required fields.');
      return;
    }

    if (selectedProduct) {
      // Edit
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
        ...p, name, sku, brand, price: Number(price), mrp: Number(mrp), stock: Number(stock), unit, category, description, isFeatured, isBestSeller
      } : p));
      toast.success('Product updated successfully!');
    } else {
      // Create
      const newProd = {
        id: `p_${Date.now()}`,
        name, sku, brand, price: Number(price), mrp: Number(mrp), stock: Number(stock), unit, category, description, isFeatured, isBestSeller,
        rating: 4.5,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'],
        specifications: { 'Shelf Life': '12 Months', 'Origin': 'India' }
      };
      setProducts(prev => [newProd, ...prev]);
      toast.success('Product created successfully!');
    }
    setIsDrawerOpen(false);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    setIsConfirmOpen(false);
    toast.success('Product deleted (Soft delete action simulated).');
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} products?`)) {
      setProducts(prev => prev.filter(p => !selectedRows.includes(p.id)));
      setSelectedRows([]);
      toast.success('Bulk products soft-deleted.');
    }
  };

  // Filter & Search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Column definitions
  const columns = [
    { header: 'SKU', key: 'sku', sortable: true, className: 'font-semibold' },
    { header: 'Product Name', key: 'name', sortable: true, render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 shrink-0 p-1 flex items-center justify-center">
          <img src={row.images?.[0]} alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold uppercase">{row.name}</span>
          <span className="text-[9px] text-zinc-400 font-light">{row.brand} • {row.unit}</span>
        </div>
      </div>
    )},
    { header: 'Category', key: 'category', render: (row) => (
      <span className="uppercase text-[10px]">{MOCK_CATEGORIES.find(c => c.id === row.category)?.name || row.category}</span>
    )},
    { header: 'Price', key: 'price', sortable: true, render: (row) => <span>₹{row.price}</span> },
    { header: 'Stock', key: 'stock', sortable: true, render: (row) => (
      <span className={`font-semibold ${row.stock <= 0 ? 'text-red-500' : row.stock < 5 ? 'text-yellow-600' : 'text-zinc-600'}`}>
        {row.stock <= 0 ? 'OUT OF STOCK' : `${row.stock} Units`}
      </span>
    )},
    { header: 'Badges', key: 'badges', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.isBestSeller && <Badge variant="dark">Best</Badge>}
        {row.isFeatured && <Badge variant="outline">Featured</Badge>}
        {row.discount > 0 && <Badge variant="danger">{row.discount}%</Badge>}
      </div>
    )},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'Edit Details', onClick: () => handleOpenEdit(row) },
          { label: 'Delete', onClick: () => handleOpenDelete(row), danger: true }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-6">
      
      {/* Search and Action Toolbar */}
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search products by SKU, name, brand..."
        onCreateClick={handleOpenCreate}
        createLabel="Add Product"
        onExportClick={() => alert('Exporting product catalog CSV...')}
      />

      {/* Dynamic Data Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        selectedRows={selectedRows}
        onRowSelectToggle={(id, checked) => 
          setSelectedRows(prev => checked ? [...prev, id] : prev.filter(r => r !== id))
        }
        onSelectAllToggle={(checked) => 
          setSelectedRows(checked ? filteredProducts.map(p => p.id) : [])
        }
        bulkActions={
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold"
          >
            <IoTrashOutline className="w-4 h-4" />
            Delete Selected
          </button>
        }
      />

      {/* CREATE / EDIT SLIDING FORM DRAWER */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProduct ? 'Edit Product Details' : 'Add New Product'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.G. ORGANIC TOMATOES"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU Code"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU"
              required
            />
            <Input
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="E.G. ORGANIC HARVEST"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Price (INR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="PRICE"
              required
            />
            <Input
              label="MRP (INR)"
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="MRP"
            />
            <Input
              label="Stock Units"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="STOCK"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pack Size / Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="E.G. 500 G"
            />
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
              >
                {MOCK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="PRODUCT DESCRIPTION"
              rows={3}
              className="w-full p-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none resize-none font-light"
            />
          </div>

          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-zinc-600">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-black"
              />
              <span className="uppercase text-[10px] tracking-wider mt-0.5">Feature Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-zinc-600">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="accent-black"
              />
              <span className="uppercase text-[10px] tracking-wider mt-0.5">Best Seller Badge</span>
            </label>
          </div>

          {/* Reusable FileUploader component */}
          <FileUploader 
            label="Product Images"
            multiple={true}
            onChange={(files) => console.log('Selected images buffer:', files)}
          />

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            {selectedProduct ? 'Save Product Changes' : 'Create Product'}
          </Button>
        </form>
      </FormDrawer>

      {/* SOFT DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Soft Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? The entry will be deactivated but historical order data is preserved.`}
        confirmLabel="Deactivate"
      />

    </div>
  );
};

export default ProductManagement;
