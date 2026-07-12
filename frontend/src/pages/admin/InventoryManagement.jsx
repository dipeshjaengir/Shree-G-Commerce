import React, { useState } from 'react';
import { IoWarningOutline, IoTrendingUpOutline, IoLayersOutline } from 'react-icons/io5';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import FormDrawer from '../../components/admin/FormDrawer.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import ActionMenu from '../../components/admin/ActionMenu.jsx';
import { MOCK_PRODUCTS } from '../../utils/mockData.js';
import { toast } from 'react-hot-toast';

const InventoryManagement = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Adjustment Form Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Adjustment Form States
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [reason, setReason] = useState('Manual Stock Audit');
  const [historyLogs, setHistoryLogs] = useState([
    { timestamp: new Date().toLocaleString(), sku: 'GRC-RICE-0001', name: 'Premium Basmati Rice', qty: '+10', reason: 'Audit Restock' },
    { timestamp: new Date().toLocaleString(), sku: 'GRC-OIL-0002', name: 'Organic Sunflower Oil', qty: '-2', reason: 'Damaged Goods' }
  ]);

  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setAdjustmentQty('');
    setReason('Manual Stock Audit');
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(adjustmentQty, 10);
    if (isNaN(qtyNum)) {
      toast.error('Please enter a valid number.');
      return;
    }

    // 1. Update stock count
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const newStock = Math.max(0, p.stock + qtyNum);
        return { ...p, stock: newStock };
      }
      return p;
    }));

    // 2. Add history log
    const newLog = {
      timestamp: new Date().toLocaleString(),
      sku: selectedProduct.sku,
      name: selectedProduct.name,
      qty: qtyNum > 0 ? `+${qtyNum}` : `${qtyNum}`,
      reason
    };
    setHistoryLogs(prev => [newLog, ...prev]);
    setIsDrawerOpen(false);
    toast.success('Stock adjusted successfully!');
  };

  // Metrics calculations
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const reservedStockMock = 12; // Static mock reserved count

  // Filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'SKU', key: 'sku', className: 'font-mono text-[10px]' },
    { header: 'Product Name', key: 'name', sortable: true, render: (row) => (
      <div className="flex flex-col text-left">
        <span className="font-semibold uppercase">{row.name}</span>
        <span className="text-[9px] text-zinc-400 font-light">{row.brand} • {row.unit}</span>
      </div>
    )},
    { header: 'Total Stock', key: 'stock', sortable: true, render: (row) => (
      <span className="font-semibold">{row.stock} units</span>
    )},
    { header: 'Reserved (Pending)', key: 'reserved', render: (row) => (
      <span className="text-zinc-400">{row.stock > 0 ? (row.id === 'p1' ? '4' : '0') : '0'} units</span>
    )},
    { header: 'Available Stock', key: 'available', render: (row) => {
      const reserved = row.stock > 0 ? (row.id === 'p1' ? 4 : 0) : 0;
      const available = Math.max(0, row.stock - reserved);
      return (
        <span className={`font-semibold ${available <= 0 ? 'text-red-500' : 'text-green-600'}`}>
          {available} units
        </span>
      );
    }},
    { header: 'Actions', key: 'actions', render: (row) => (
      <ActionMenu
        actions={[
          { label: 'Adjust Stock', onClick: () => handleOpenAdjust(row) }
        ]}
      />
    )}
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. METRICS STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stock Units" value={totalStockCount} icon={IoLayersOutline} />
        <StatCard title="Reserved Stock" value={`${reservedStockMock} Units`} icon={IoLayersOutline} />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          trend={lowStockCount > 0 ? `${lowStockCount} items need reorder` : 'All items healthy'} 
          trendType={lowStockCount > 0 ? 'danger' : 'neutral'}
          icon={IoWarningOutline} 
        />
        <StatCard 
          title="Out of Stock Items" 
          value={outOfStockCount} 
          trend={outOfStockCount > 0 ? `${outOfStockCount} items empty` : 'No empty catalog items'} 
          trendType={outOfStockCount > 0 ? 'danger' : 'neutral'}
          icon={IoWarningOutline} 
        />
      </div>

      {/* 2. INVENTORY TABLE */}
      <div className="space-y-4">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase">Stock Inventory List</h3>
        </div>
        
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search inventory by SKU or product name..."
        />

        <DataTable
          columns={columns}
          data={filteredProducts}
        />
      </div>

      {/* 3. STOCK HISTORY LOGS */}
      <div className="space-y-4 bg-white border border-zinc-200 p-6 text-left">
        <div className="border-b border-zinc-100 pb-3 mb-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
            <IoTrendingUpOutline className="w-4 h-4" />
            Stock Adjustment History Logs
          </h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {historyLogs.map((log, idx) => (
            <div key={idx} className="flex justify-between items-center text-[10px] tracking-wider border-b border-zinc-50 pb-2 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <span className="font-semibold text-black uppercase">{log.name}</span>
                <span className="text-zinc-400 font-light">{log.timestamp} • SKU: {log.sku} • Reason: {log.reason}</span>
              </div>
              <span className={`font-semibold ${log.qty.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {log.qty} Units
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ADJUSTMENT FORM DRAWER */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Adjust Stock: ${selectedProduct?.name}`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="bg-zinc-50 p-4 border border-zinc-100 space-y-1">
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Current Stock Balance</span>
            <div className="text-xl font-light">{selectedProduct?.stock} Units</div>
          </div>

          <Input
            label="Adjustment Quantity (Use minus for subtraction)"
            type="number"
            value={adjustmentQty}
            onChange={(e) => setAdjustmentQty(e.target.value)}
            placeholder="E.G. +50 OR -10"
            required
          />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Reason for Adjustment</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
            >
              <option value="Manual Stock Audit">Manual Stock Audit</option>
              <option value="Vendor Replenishment">Vendor Replenishment</option>
              <option value="Damaged Stock Write-off">Damaged Stock Write-off</option>
              <option value="Customer Return Restock">Customer Return Restock</option>
            </select>
          </div>

          <Button 
            type="submit"
            className="w-full pt-3"
          >
            Apply Adjustment
          </Button>
        </form>
      </FormDrawer>

    </div>
  );
};

export default InventoryManagement;
