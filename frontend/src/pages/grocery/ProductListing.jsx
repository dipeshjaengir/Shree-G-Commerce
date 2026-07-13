import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IoFilterOutline, IoChevronDownOutline, IoCloseOutline } from 'react-icons/io5';
import ProductCard from '../../components/ProductCard.jsx';
import { CardSkeleton } from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_BRANDS } from '../../utils/mockData.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cartSlice.js';
import { toast } from 'react-hot-toast';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(600);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Quick View Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with URL params (e.g. from clicking categories on Navbar or Home)
  useEffect(() => {
    const catParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const sortParam = searchParams.get('sort');

    if (catParam) {
      setSelectedCategories([catParam]);
    }
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Apply filters and sorting with loading simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...MOCK_PRODUCTS];

      // 1. Category Filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
      }

      // 2. Brand Filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(p => selectedBrands.includes(p.brand));
      }

      // 3. Price Filter
      filtered = filtered.filter(p => p.price <= priceRange);

      // 4. Discount Filter
      if (minDiscount > 0) {
        filtered = filtered.filter(p => p.discount >= minDiscount);
      }

      // 5. Stock Filter
      if (inStockOnly) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      // 6. Sorting
      if (sortBy === 'newest') {
        filtered.sort((a, b) => (a.isNewArrival ? -1 : 1));
      } else if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'bestSelling') {
        filtered.sort((a, b) => (a.isBestSeller ? -1 : 1));
      }

      setProducts(filtered);
      setIsLoading(false);
      setCurrentPage(1); // Reset page to 1
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategories, selectedBrands, priceRange, minDiscount, inStockOnly, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleBrandChange = (brandName) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(600);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Pagination Helper
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Mobile controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase">All Groceries</h2>
          <span className="text-[10px] text-zinc-400 font-light tracking-wider uppercase">
            Showing {products.length} Products
          </span>
        </div>
        
        {/* Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 border border-zinc-200 px-3 py-1.5 bg-white text-xs hover:border-black transition-colors"
          >
            <IoFilterOutline className="w-4 h-4" />
            Filters
          </button>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] tracking-widest text-zinc-400 uppercase font-light">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-zinc-200 bg-white text-xs px-2.5 py-1.5 outline-none focus:border-black rounded-none"
            >
              <option value="newest">New Arrivals</option>
              <option value="bestSelling">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* ==================== 1. FILTER SIDEBAR (DESKTOP) ==================== */}
        <aside className="hidden md:block space-y-6 border border-zinc-200 bg-white p-6 sticky top-24">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold tracking-wider uppercase">Filters</span>
            <button 
              onClick={clearAllFilters}
              className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Category</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {MOCK_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-xs font-light text-zinc-600 hover:text-black">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="accent-black rounded-none"
                  />
                  <span className="uppercase text-[10px] tracking-wider mt-0.5">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5 border-t border-zinc-100 pt-4">
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Brand</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {MOCK_BRANDS.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-xs font-light text-zinc-600 hover:text-black">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="accent-black rounded-none"
                  />
                  <span className="uppercase text-[10px] tracking-wider mt-0.5">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 border-t border-zinc-100 pt-4">
            <div className="flex justify-between text-[10px] tracking-widest text-zinc-400 uppercase font-light">
              <span>Max Price</span>
              <span className="text-black font-semibold">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black bg-zinc-200 h-1"
            />
          </div>

          {/* Discount Filter */}
          <div className="space-y-2.5 border-t border-zinc-100 pt-4">
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Minimum Discount</span>
            <div className="flex gap-2">
              {[0, 15, 20, 25].map(disc => (
                <button
                  key={disc}
                  onClick={() => setMinDiscount(disc)}
                  className={`text-[9px] font-semibold tracking-wider px-2.5 py-1 border transition-all ${
                    minDiscount === disc 
                      ? 'bg-black border-black text-white' 
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-black'
                  }`}
                >
                  {disc === 0 ? 'ALL' : `${disc}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Switch */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
              className="accent-black"
            />
          </div>

        </aside>

        {/* ==================== 2. PRODUCT GRID (RIGHT SIDE) ==================== */}
        <div className="md:col-span-3 space-y-8">
          
          {isLoading ? (
            /* Loading skeletons while query runs */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <CardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty state message */
            <EmptyState
              title="No Products Match Your Filters"
              description="Try adjusting your category checks, price sliders, or brands to locate items."
              actionLabel="Clear Filters"
              onActionClick={clearAllFilters}
            />
          ) : (
            /* Product grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {products.length > itemsPerPage && !isLoading && (
            <div className="flex items-center justify-center gap-2 border-t border-zinc-200 pt-6">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Prev
              </Button>
              <span className="text-xs tracking-widest text-zinc-500 font-light mx-4 uppercase">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}

        </div>

      </div>

      {/* ==================== 3. MOBILE FILTERS DRAWER ==================== */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setShowMobileFilters(false)}
            className="fixed inset-0 bg-black/50"
          />
          {/* Modal Content */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full z-10 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <span className="font-semibold tracking-[0.2em] text-xs">FILTERS</span>
                <button onClick={() => setShowMobileFilters(false)}>
                  <IoCloseOutline className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Mobile Category check */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Category</span>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {MOCK_CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs font-light text-zinc-600">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <span className="uppercase text-[9px] tracking-wider">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Brand check */}
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Brand</span>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {MOCK_BRANDS.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-xs font-light text-zinc-600">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="uppercase text-[9px] tracking-wider">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price check */}
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <div className="flex justify-between text-[10px] tracking-widest text-zinc-400 uppercase font-light">
                  <span>Max Price</span>
                  <span className="text-black font-semibold">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-black h-1"
                />
              </div>

              {/* Mobile Discount Check */}
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light block">Minimum Discount</span>
                <div className="flex gap-2">
                  {[0, 15, 20, 25].map(disc => (
                    <button
                      key={disc}
                      onClick={() => setMinDiscount(disc)}
                      className={`text-[9px] font-semibold tracking-wider px-2 py-1 border ${
                        minDiscount === disc ? 'bg-black text-white' : 'bg-white border-zinc-200 text-zinc-600'
                      }`}
                    >
                      {disc === 0 ? 'ALL' : `${disc}%+`}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="border-t border-zinc-100 pt-4 flex gap-2">
              <Button 
                variant="outline" 
                className="w-1/2" 
                onClick={() => {
                  clearAllFilters();
                  setShowMobileFilters(false);
                }}
              >
                Clear
              </Button>
              <Button 
                className="w-1/2" 
                onClick={() => setShowMobileFilters(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. QUICK VIEW MODAL ==================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct?.name}
        size="lg"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="w-full bg-white border border-zinc-200 p-4 flex items-center justify-center h-64 overflow-hidden relative">
              {selectedProduct.discount > 0 && (
                <Badge variant="danger" className="absolute top-4 left-4">
                  {selectedProduct.discount}% OFF
                </Badge>
              )}
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light">
                  {selectedProduct.brand} • {selectedProduct.unit}
                </span>
                <h2 className="text-lg font-semibold tracking-wider text-black uppercase">
                  {selectedProduct.name}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-semibold">₹{selectedProduct.price}</span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <span className="text-xs text-zinc-400 line-through">₹{selectedProduct.mrp}</span>
                )}
              </div>

              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                {selectedProduct.description}
              </p>

              <hr className="border-zinc-200" />

              <div className="space-y-1.5">
                <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Product Specs</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] tracking-wider font-light">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-0.5 border-b border-zinc-100 pb-1">
                      <span className="text-zinc-400">{key}</span>
                      <span className="text-black font-normal">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={async () => {
                    if (!isAuthenticated) {
                      toast.error('Please log in to add items to your cart.');
                      navigate('/login');
                      return;
                    }
                    try {
                      const resultAction = await dispatch(addToCartThunk({ productId: selectedProduct._id || selectedProduct.id, quantity: 1 }));
                      if (addToCartThunk.fulfilled.match(resultAction)) {
                        toast.success(`${selectedProduct.name} added to cart!`);
                      } else {
                        toast.error(resultAction.payload || 'Failed to add item to cart');
                      }
                    } catch (err) {
                      toast.error('An error occurred. Please try again.');
                    }
                    handleCloseModal();
                  }}
                  className="w-full"
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ProductListing;
