import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoHeartOutline, IoHeart, IoStar, IoCheckmarkCircleOutline, 
  IoArrowBackOutline, IoShareSocialOutline 
} from 'react-icons/io5';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import SectionTitle from '../../components/SectionTitle.jsx';
import { MOCK_PRODUCTS } from '../../utils/mockData.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cartSlice.js';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  
  // Load product details
  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.images[0]);
      setSelectedWeight(found.unit);
      window.scrollTo(0, 0); // scroll to top
    }
  }, [id]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-400">Loading Product...</h2>
      </div>
    );
  }

  // Related products
  const relatedProducts = MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Dynamic Image Zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Mock Reviews
  const reviews = [
    { name: "Vikram S.", rating: 5, date: "July 10, 2026", comment: "Outstanding quality. Fresh, fragrant grains that cook perfectly every time. Extremely clean packaging." },
    { name: "Priya R.", rating: 4, date: "June 28, 2026", comment: "Very good authentic aroma. Delivery was super fast via Shree G Mart." }
  ];

  return (
    <div className="space-y-16">
      
      {/* 1. BACK BUTTON */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors duration-300 text-xs tracking-widest font-light group"
        >
          <IoArrowBackOutline className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          BACK TO SHOP
        </button>
        <button className="text-zinc-400 hover:text-black transition-colors" title="Share Product">
          <IoShareSocialOutline className="w-5 h-5" />
        </button>
      </div>

      {/* 2. PRODUCT VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Gallery & Interactive Zoom */}
        <div className="space-y-4">
          <div 
            className="w-full bg-white border border-zinc-200 p-6 flex items-center justify-center h-96 overflow-hidden relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {product.discount > 0 && (
              <Badge variant="danger" className="absolute top-6 left-6 z-10">
                {product.discount}% OFF
              </Badge>
            )}
            <img
              src={activeImage}
              alt={product.name}
              style={zoomStyle}
              className="w-full h-full object-cover transition-transform duration-100 ease-out"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 bg-white border p-2 overflow-hidden flex items-center justify-center transition-all ${
                    activeImage === img ? 'border-black' : 'border-zinc-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information details */}
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-light">
              {product.brand} • Brand Partner
            </span>
            <h1 className="text-2xl font-light tracking-wide text-black uppercase">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? '' : 'text-zinc-200'}`} />
                ))}
              </div>
              <span className="text-[10px] text-zinc-400 tracking-wider font-light mt-0.5">
                ({product.rating} Stars / 2 Customer Reviews)
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="flex items-end gap-3 border-y border-zinc-100 py-4">
            <span className="text-2xl font-light">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-zinc-400 line-through pb-0.5">₹{product.mrp}</span>
                <span className="text-xs text-red-500 font-semibold uppercase tracking-wider pb-0.5">
                  ({product.discount}% Save)
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Description</span>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pack Weight Picker */}
          <div className="space-y-3">
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Pack Sizes</span>
            <div className="flex gap-2">
              {[product.unit, '2x ' + product.unit, 'Bulk Pack'].map((weightOption) => (
                <button
                  key={weightOption}
                  onClick={() => setSelectedWeight(weightOption)}
                  className={`text-[9px] font-semibold tracking-wider px-4 py-2 border transition-all ${
                    selectedWeight === weightOption 
                      ? 'bg-black border-black text-white' 
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-black'
                  }`}
                >
                  {weightOption.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              disabled={product.stock <= 0}
              onClick={async () => {
                if (!isAuthenticated) {
                  toast.error('Please log in to add items to your cart.');
                  navigate('/login');
                  return;
                }
                try {
                  const resultAction = await dispatch(addToCartThunk({ productId: product._id || product.id, quantity: 1 }));
                  if (addToCartThunk.fulfilled.match(resultAction)) {
                    toast.success(`${product.name} added to cart!`);
                  } else {
                    toast.error(resultAction.payload || 'Failed to add item to cart');
                  }
                } catch (err) {
                  toast.error('An error occurred. Please try again.');
                }
              }}
              className="flex-1"
            >
              {product.stock <= 0 ? 'Out Of Stock' : 'Add To Cart'}
            </Button>
            
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-12 h-12 flex items-center justify-center border transition-all ${
                isWishlisted ? 'border-red-500 text-red-500' : 'border-zinc-200 text-zinc-400 hover:border-black hover:text-black'
              }`}
            >
              {isWishlisted ? <IoHeart className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />}
            </button>
          </div>

          {/* Specifications list */}
          <div className="space-y-3 pt-6 border-t border-zinc-100">
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Product Specifications</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] tracking-wider font-light">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="text-zinc-400">{key}</span>
                  <span className="text-black font-normal">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. BUNDLED OFFER: FREQUENTLY BOUGHT TOGETHER */}
      <section className="bg-white border border-zinc-200 p-8 space-y-6">
        <h3 className="text-xs font-semibold tracking-widest uppercase">Frequently Bought Together</h3>
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Current Item */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border border-zinc-200 p-1 bg-zinc-50 flex items-center justify-center">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold tracking-wider max-w-[120px] line-clamp-1">{product.name}</span>
                <span className="text-[9px] text-zinc-500">₹{product.price}</span>
              </div>
            </div>
            
            <span className="text-zinc-400 text-lg font-light">+</span>

            {/* Mock Item 1 */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border border-zinc-200 p-1 bg-zinc-50 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold tracking-wider max-w-[120px] line-clamp-1">Fresh Alphonso Mangoes</span>
                <span className="text-[9px] text-zinc-500">₹450</span>
              </div>
            </div>

            <span className="text-zinc-400 text-lg font-light">+</span>

            {/* Mock Item 2 */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border border-zinc-200 p-1 bg-zinc-50 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=100&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold tracking-wider max-w-[120px] line-clamp-1">Farm Fresh Organic Eggs</span>
                <span className="text-[9px] text-zinc-500">₹80</span>
              </div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-8 text-center md:text-right shrink-0">
            <div className="space-y-1 mb-4">
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Bundle Price</span>
              <div className="text-xl font-light">₹{product.price + 450 + 80}</div>
            </div>
            <Button
              onClick={async () => {
                if (!isAuthenticated) {
                  toast.error('Please log in to add items to your cart.');
                  navigate('/login');
                  return;
                }
                try {
                  await dispatch(addToCartThunk({ productId: product._id || product.id, quantity: 1 })).unwrap();
                  toast.success('Bundle items added to cart!');
                } catch (err) {
                  toast.error(err || 'Failed to add bundle to cart');
                }
              }}
              size="sm"
            >
              Add 3 Items To Cart
            </Button>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section className="space-y-6">
        <h3 className="text-xs font-semibold tracking-widest uppercase">Customer Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Reviews Score Card */}
          <div className="bg-white border border-zinc-200 p-6 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-5xl font-light">{product.rating}</span>
            <div className="flex gap-0.5 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <IoStar key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? '' : 'text-zinc-200'}`} />
              ))}
            </div>
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Out of 5 Stars</span>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 p-6 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wider uppercase">{rev.name}</span>
                    <span className="text-[9px] text-zinc-400 tracking-wider mt-0.5">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IoStar key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? '' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  {rev.comment}
                </p>
                <div className="flex items-center gap-1.5 text-green-600 text-[9px] tracking-widest uppercase font-semibold">
                  <IoCheckmarkCircleOutline className="w-3.5 h-3.5" />
                  Verified Buyer
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <SectionTitle 
            title="Related Products" 
            subtitle="Explore Similar Items"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={() => navigate(`/mart/product/${prod.id}`)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
