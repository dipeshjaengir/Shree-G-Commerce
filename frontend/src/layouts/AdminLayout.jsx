import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  IoGridOutline, IoBagHandleOutline, IoFolderOpenOutline, 
  IoReceiptOutline, IoPeopleOutline, IoTicketOutline, IoGiftOutline, 
  IoStatsChartOutline, IoImagesOutline, IoSettingsOutline, IoPersonCircleOutline, 
  IoLayersOutline, IoNotificationsOutline, IoReaderOutline, IoLogOutOutline, IoArrowBackOutline 
} from 'react-icons/io5';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: IoGridOutline },
    { name: 'Products', path: '/admin/products', icon: IoBagHandleOutline },
    { name: 'Categories', path: '/admin/categories', icon: IoFolderOpenOutline },
    { name: 'Orders', path: '/admin/orders', icon: IoReceiptOutline },
    { name: 'Customers', path: '/admin/customers', icon: IoPeopleOutline },
    { name: 'Coupons', path: '/admin/coupons', icon: IoTicketOutline },
    { name: 'Offers', path: '/admin/offers', icon: IoGiftOutline },
    { name: 'Inventory', path: '/admin/inventory', icon: IoLayersOutline },
    { name: 'Reports', path: '/admin/reports', icon: IoStatsChartOutline },
    { name: 'Banners', path: '/admin/banners', icon: IoImagesOutline },
    { name: 'Settings', path: '/admin/settings', icon: IoSettingsOutline },
    { name: 'Admin Profile', path: '/admin/profile', icon: IoPersonCircleOutline },
    { name: 'Notifications', path: '/admin/notifications', icon: IoNotificationsOutline },
    { name: 'Activity Logs', path: '/admin/logs', icon: IoReaderOutline }
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F8F8] text-black font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between border-r border-zinc-800 shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col overflow-y-auto">
          {/* Admin Header */}
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-light">Shree G</span>
              <span className="text-sm font-semibold tracking-wider">CONSOLE</span>
            </div>
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors" title="Back to site">
              <IoArrowBackOutline className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 text-xs tracking-wider font-light transition-all rounded-none ${
                    isActive 
                      ? 'bg-white text-black font-medium' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-zinc-900">
          <button 
            onClick={() => {
              alert('Logging out...');
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider font-light text-red-400 hover:text-red-300 hover:bg-zinc-900 transition-all"
          >
            <IoLogOutOutline className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKING PANEL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xs font-semibold tracking-[0.3em] uppercase">
            {sidebarLinks.find(link => link.path === location.pathname)?.name || 'Admin Console'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-wider text-zinc-500">Welcome, Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs">
              SA
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
