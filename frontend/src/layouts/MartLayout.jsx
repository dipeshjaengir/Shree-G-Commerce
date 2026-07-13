import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  IoCartOutline, IoHeartOutline, IoPersonOutline, 
  IoMenuOutline, IoCloseOutline, IoChevronDownOutline 
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logoutUser } from '../redux/slices/authSlice.js';
import { fetchCart } from '../redux/slices/cartSlice.js';
import { fetchWishlist } from '../redux/slices/wishlistSlice.js';
import { toast } from 'react-hot-toast';

const CATEGORIES_LIST = [
  { name: 'Atta & Rice', path: '/mart/category/atta-rice' },
  { name: 'Dairy & Eggs', path: '/mart/category/dairy-eggs' },
  { name: 'Snacks & Sweets', path: '/mart/category/snacks-sweets' },
  { name: 'Beverages', path: '/mart/category/beverages' },
  { name: 'Fresh Vegetables', path: '/mart/category/fresh-vegetables' },
  { name: 'Fresh Fruits', path: '/mart/category/fresh-fruits' },
  { name: 'Personal Care', path: '/mart/category/personal-care' },
  { name: 'Cleaning & Household', path: '/mart/category/cleaning-household' }
];

const MartLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const { products: wishlistProducts = [] } = useSelector((state) => state.wishlist || {});

  // Fetch user profile on mount to restore session
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Fetch cart & wishlist once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully.');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  // Monitor scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-black font-sans selection:bg-black selection:text-white">
      
      {/* 1. STICKY NAVBAR */}
      <header 
        className={`sticky top-0 z-40 bg-white border-b transition-all duration-300 ${
          isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-transparent' : 'border-zinc-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo Group */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold tracking-wider text-sm transition-transform duration-300 group-hover:scale-105">
              SG
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-light tracking-[0.4em] text-zinc-400 leading-none">SHREE G</span>
              <span className="text-sm font-semibold tracking-[0.2em] leading-tight">MART</span>
            </div>
          </Link>

          {/* Reusable Search Bar */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Action Links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-sm tracking-wider font-light shrink-0">
            {/* Category dropdown toggle */}
            <div 
              className="relative hidden lg:block"
              onMouseEnter={() => setShowCatDropdown(true)}
              onMouseLeave={() => setShowCatDropdown(false)}
            >
              <button className="flex items-center gap-1 hover:text-zinc-500 transition-colors uppercase text-xs">
                Categories
                <IoChevronDownOutline className={`w-3.5 h-3.5 transition-transform duration-300 ${showCatDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showCatDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-6 left-0 bg-white border border-zinc-200 shadow-2xl p-4 w-56 grid grid-cols-1 gap-2"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <Link
                        key={cat.name}
                        to="/mart/products" // all route to listing with category filter in Phase 2
                        onClick={() => setShowCatDropdown(false)}
                        className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider font-light py-1 border-b border-zinc-50 hover:border-black transition-all"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shop Shortcut */}
            <Link to="/mart/products" className="hidden sm:block hover:text-zinc-500 transition-colors uppercase text-xs">
              Shop
            </Link>

            {/* Wishlist Link */}
            <Link to="/mart/wishlist" className="relative hover:text-zinc-500 transition-colors" title="Wishlist">
              <IoHeartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistProducts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {wishlistProducts.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/mart/cart" className="relative hover:text-zinc-500 transition-colors" title="Cart">
              <IoCartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <Link to="/mart/profile" className="hover:text-zinc-500 transition-colors" title="Profile">
                <IoPersonOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-6 bg-white border border-zinc-200 shadow-2xl p-4 w-40 flex flex-col gap-2 z-50"
                  >
                    {isAuthenticated ? (
                      <>
                        <Link to="/mart/profile" className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider font-light">My Account</Link>
                        <hr className="border-zinc-100" />
                        <button 
                          onClick={handleLogout}
                          className="text-[10px] text-red-500 hover:text-red-700 uppercase tracking-wider font-light text-left"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider font-light">Login / Sign In</Link>
                        <Link to="/signup" className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider font-light">Register</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Burger Toggle */}
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden text-black hover:text-zinc-600 transition-colors"
            >
              <IoMenuOutline className="w-6 h-6" />
            </button>
          </nav>
        </div>

        {/* Mobile search bar (shows on mobile screens only) */}
        <div className="md:hidden px-4 pb-4 bg-white border-t border-zinc-100 pt-2">
          <SearchBar />
        </div>
      </header>

      {/* 2. MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[80vw] bg-white h-full z-10 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                  <span className="font-semibold tracking-[0.2em] text-sm">SG MART</span>
                  <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black"
                  >
                    <IoCloseOutline className="w-6 h-6" />
                  </button>
                </div>
                {/* Links */}
                <nav className="flex flex-col gap-4 text-xs tracking-widest font-light uppercase">
                  <Link to="/mart" onClick={() => setShowMobileMenu(false)} className="hover:text-zinc-500">Home</Link>
                  <Link to="/mart/products" onClick={() => setShowMobileMenu(false)} className="hover:text-zinc-500">Shop Catalog</Link>
                  <Link to="/mart/wishlist" onClick={() => setShowMobileMenu(false)} className="hover:text-zinc-500">Wishlist</Link>
                  <Link to="/mart/cart" onClick={() => setShowMobileMenu(false)} className="hover:text-zinc-500">Cart</Link>
                  <Link to="/mart/profile" onClick={() => setShowMobileMenu(false)} className="hover:text-zinc-500">Profile</Link>
                </nav>
              </div>

              {/* Footer inside drawer */}
              <div className="text-[9px] tracking-[0.2em] text-zinc-400 font-light border-t border-zinc-100 pt-4 uppercase">
                © 2026 SHREE G COMMERCE.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PAGE CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-zinc-200 py-12 text-xs text-zinc-500 tracking-wider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-semibold tracking-[0.2em] text-black">SHREE G MART</span>
            <p className="font-light leading-relaxed">
              Premium curated grocery selection for families with exquisite taste. High quality organic, fresh, and local staples.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold tracking-[0.2em] text-black uppercase mb-1">Store Sections</span>
            <Link to="/mart/products" className="hover:text-black font-light transition-colors">All Products</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Fresh Harvest</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Bakery Selections</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Essential Staples</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold tracking-[0.2em] text-black uppercase mb-1">Company</span>
            <Link to="/mart" className="hover:text-black font-light transition-colors">About Us</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Terms of Service</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Privacy Policy</Link>
            <Link to="/mart" className="hover:text-black font-light transition-colors">Contact Support</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold tracking-[0.2em] text-black uppercase">Newsletter</span>
            <p className="font-light leading-relaxed">Subscribe for notifications on premium fresh stock arrivals.</p>
            <div className="flex border-b border-zinc-300 pb-1">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="bg-transparent border-none text-[10px] w-full focus:outline-none"
              />
              <button className="text-[10px] font-semibold text-black hover:text-zinc-600">JOIN</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-100 text-center text-[10px] text-zinc-400 uppercase">
          © 2026 SHREE G COMMERCE. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default MartLayout;
