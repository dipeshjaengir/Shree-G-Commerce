import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSlider from '../../components/HeroSlider.jsx';
import CategoryCard from '../../components/CategoryCard.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import SectionTitle from '../../components/SectionTitle.jsx';
import Modal from '../../components/Modal.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_BRANDS } from '../../utils/mockData.js';
import useSEO from '../../hooks/useSEO.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cartSlice.js';
import { toast } from 'react-hot-toast';

const MartHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useSEO({
    title: 'Premium Grocery Mart',
    description: 'Shop fresh vegetables, dairy, grains, and household essentials at Shree G Mart.',
    canonicalPath: '/mart'
  });

  // Modal State for Quick View
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter products by states
  const dealsOfTheDay = MOCK_PRODUCTS.filter(p => p.discount >= 20);
  const bestSellers = MOCK_PRODUCTS.filter(p => p.isBestSeller);
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.isFeatured);
  const newArrivals = MOCK_PRODUCTS.filter(p => p.isNewArrival);

  return (
    <div className="space-y-16">
      
      {/* 1. HERO SLIDER BANNER */}
      <HeroSlider />

      {/* 2. CATEGORIES SECTION */}
      <section>
        <SectionTitle 
          title="Shop by Category" 
          subtitle="Selected Harvests"
          actionLabel="View All"
          onActionClick={() => navigate('/mart/products')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              image={cat.image}
              itemsCount={cat.itemsCount}
              onClick={() => navigate(`/mart/products?category=${cat.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 3. DEALS OF THE DAY */}
      {dealsOfTheDay.length > 0 && (
        <section>
          <SectionTitle 
            title="Deals of the Day" 
            subtitle="Exceptional Offers"
            actionLabel="View All"
            onActionClick={() => navigate('/mart/products?sort=discount')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {dealsOfTheDay.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section>
          <SectionTitle 
            title="Best Sellers" 
            subtitle="Customer Favorites"
            actionLabel="View All"
            onActionClick={() => navigate('/mart/products?sort=bestSelling')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section>
          <SectionTitle 
            title="Featured Products" 
            subtitle="Curated Selections"
            actionLabel="View All"
            onActionClick={() => navigate('/mart/products?filter=featured')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. RECENTLY ADDED */}
      {newArrivals.length > 0 && (
        <section>
          <SectionTitle 
            title="Recently Added" 
            subtitle="Fresh Arrivals"
            actionLabel="View All"
            onActionClick={() => navigate('/mart/products?sort=newest')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. POPULAR BRANDS */}
      <section className="bg-white border border-zinc-200 py-10 px-8">
        <h3 className="text-center text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light mb-8">
          Trusted Partners & Brands
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
          {MOCK_BRANDS.map((brand) => (
            <span 
              key={brand} 
              className="text-xs tracking-[0.25em] font-semibold text-zinc-400 hover:text-black transition-colors cursor-pointer uppercase"
              onClick={() => navigate(`/mart/products?brand=${brand}`)}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 8. QUICK VIEW MODAL COMPONENT */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct?.name}
        size="lg"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Image section */}
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

            {/* Product Details Section */}
            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light">
                  {selectedProduct.brand} • {selectedProduct.unit}
                </span>
                <h2 className="text-lg font-semibold tracking-wider text-black uppercase">
                  {selectedProduct.name}
                </h2>
              </div>

              {/* Price Details */}
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold">₹{selectedProduct.price}</span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <span className="text-xs text-zinc-400 line-through">₹{selectedProduct.mrp}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                {selectedProduct.description}
              </p>

              <hr className="border-zinc-200" />

              {/* Specifications snippet */}
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

              {/* CTA Action */}
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

              {/* Full details link */}
              <div className="text-center">
                <button 
                  onClick={() => {
                    handleCloseModal();
                    navigate(`/mart/product/${selectedProduct._id || selectedProduct.id}`);
                  }}
                  className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase border-b border-zinc-300 hover:border-black transition-all pb-0.5"
                >
                  View Full Product Details
                </button>
              </div>

            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default MartHome;
