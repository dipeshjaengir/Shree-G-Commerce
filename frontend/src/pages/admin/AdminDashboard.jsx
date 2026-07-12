import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoCashOutline, IoBagHandleOutline, IoPeopleOutline, IoWarningOutline,
  IoStatsChartOutline, IoSettingsOutline, IoDocumentTextOutline, IoAddOutline
} from 'react-icons/io5';
import StatCard from '../../components/admin/StatCard.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock stats
  const stats = {
    todayRevenue: '₹2,450',
    weeklyRevenue: '₹14,800',
    monthlyRevenue: '₹58,200',
    yearlyRevenue: '₹6,48,000',
    totalOrders: 142,
    pendingOrders: 14,
    deliveredOrders: 118,
    cancelledOrders: 10,
    totalCustomers: 84,
    activeCustomers: 72,
    totalProducts: 48,
    lowStockProducts: 4,
    outOfStockProducts: 2
  };

  const recentOrders = [
    { orderNo: 'SG202607120001', customer: 'Dipesh Kumar', total: '₹160', status: 'Placed' },
    { orderNo: 'SG202607120002', customer: 'Aarav Mehta', total: '₹630', status: 'Delivered' }
  ];

  const recentCustomers = [
    { name: 'Dipesh Kumar', email: 'dipesh@gmail.com', joined: 'Today' },
    { name: 'Aarav Mehta', email: 'aarav@gmail.com', joined: 'Yesterday' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome banner */}
      <div className="border-b border-zinc-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Management Console</span>
          <h2 className="text-xl font-light tracking-wide mt-1">SHREE G CONSOLE</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={IoSettingsOutline} onClick={() => navigate('/admin/settings')}>
            System Configs
          </Button>
          <Button size="sm" icon={IoAddOutline} onClick={() => navigate('/admin/products')}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* 1. FINANCIAL SUMMARY METRICS */}
      <div className="space-y-4">
        <h3 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light">Financial Revenue Logs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Today's Revenue" value={stats.todayRevenue} trend="+12% from yesterday" trendType="up" icon={IoCashOutline} />
          <StatCard title="Weekly Revenue" value={stats.weeklyRevenue} trend="+8% from last week" trendType="up" icon={IoCashOutline} />
          <StatCard title="Monthly Revenue" value={stats.monthlyRevenue} trend="+15% from last month" trendType="up" icon={IoCashOutline} />
          <StatCard title="Yearly Revenue" value={stats.yearlyRevenue} trend="Target: ₹10L" trendType="neutral" icon={IoCashOutline} />
        </div>
      </div>

      {/* 2. ORDER PROCESSING VOLUME STATS */}
      <div className="space-y-4">
        <h3 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light">Order Processing Volume</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Placed Orders" value={stats.totalOrders} icon={IoBagHandleOutline} />
          <StatCard title="Pending Status" value={stats.pendingOrders} trend={`${stats.pendingOrders} orders queue`} trendType={stats.pendingOrders > 0 ? 'warning' : 'neutral'} icon={IoBagHandleOutline} />
          <StatCard title="Delivered Invoices" value={stats.deliveredOrders} trend="93% success rate" trendType="up" icon={IoBagHandleOutline} />
          <StatCard title="Cancelled Bookings" value={stats.cancelledOrders} trend="7% cancel rate" trendType="danger" icon={IoBagHandleOutline} />
        </div>
      </div>

      {/* 3. INVENTORY & CUSTOMER COUNTS */}
      <div className="space-y-4">
        <h3 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light">Inventory & Customer Segment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Customers" value={stats.totalCustomers} icon={IoPeopleOutline} />
          <StatCard title="Active Session Users" value={stats.activeCustomers} trend="85% retention rate" trendType="up" icon={IoPeopleOutline} />
          <StatCard title="Low Stock Products" value={stats.lowStockProducts} trend={`${stats.lowStockProducts} items warning`} trendType={stats.lowStockProducts > 0 ? 'warning' : 'neutral'} icon={IoWarningOutline} />
          <StatCard title="Out of Stock Alerts" value={stats.outOfStockProducts} trend={`${stats.outOfStockProducts} items empty`} trendType={stats.outOfStockProducts > 0 ? 'danger' : 'neutral'} icon={IoWarningOutline} />
        </div>
      </div>

      {/* 4. MOCK CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between h-64">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
              <IoStatsChartOutline className="w-4 h-4" />
              Daily Revenue Flow (Last 7 Days)
            </span>
            <span className="text-[10px] text-zinc-400 font-light">Updated real-time</span>
          </div>
          {/* Simple mockup bar diagram */}
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[40, 60, 50, 75, 90, 80, 100].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div style={{ height: `${height}%` }} className="w-6 bg-black hover:bg-zinc-800 transition-colors"></div>
                <span className="text-[9px] text-zinc-400 font-mono">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders volume chart */}
        <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between h-64">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
              <IoStatsChartOutline className="w-4 h-4" />
              Orders Volume Trends
            </span>
            <span className="text-[10px] text-zinc-400 font-light">Average: 20/day</span>
          </div>
          {/* Simple mockup line diagram */}
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[20, 30, 45, 25, 60, 50, 70].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1 justify-end h-full">
                <div className="w-2 h-2 rounded-full bg-black mb-1"></div>
                <div style={{ height: `${height}%` }} className="w-[1px] bg-zinc-200"></div>
                <span className="text-[9px] text-zinc-400 font-mono">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
              <IoDocumentTextOutline className="w-4 h-4" />
              Recent Orders Log
            </span>
            <button onClick={() => navigate('/admin/orders')} className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-semibold">
              View All
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {recentOrders.map((order) => (
              <div key={order.orderNo} className="py-3 flex justify-between items-center text-xs tracking-wider">
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-black">{order.orderNo}</span>
                  <span className="text-[9px] text-zinc-400 font-light">{order.customer}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{order.total}</span>
                  <Badge variant={order.status === 'Delivered' ? 'dark' : 'outline'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Customers */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
              <IoPeopleOutline className="w-4 h-4" />
              New Registrations
            </span>
            <button onClick={() => navigate('/admin/customers')} className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-semibold">
              View All
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {recentCustomers.map((c) => (
              <div key={c.email} className="py-3 flex flex-col text-left text-xs gap-0.5">
                <span className="font-semibold text-black uppercase">{c.name}</span>
                <span className="text-[9px] text-zinc-400 font-light">{c.email}</span>
                <span className="text-[9px] text-zinc-400 font-light block pt-1">Registered: {c.joined}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
