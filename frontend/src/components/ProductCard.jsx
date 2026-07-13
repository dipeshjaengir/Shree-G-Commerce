import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoEyeOutline, IoStar } from 'react-icons/io5';
import Badge from './Badge.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartThunk } from '../redux/slices/cartSlice.js';
import { toast } from 'react-hot-toast';

const ProductCard = ({
  product,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
  className = ''
}) => {
  const {
    name,
    brand,
    price,
    mrp,
    discount,
    stock,
    unit,
    rating = 4.5,
    isFeatured = false,
    isNewArrival = false,
    isBestSeller = false,
    images = []
  } = product;

  const [wishlistActive, setWishlistActive] = useState(isWishlisted);
  const imageUrl = images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
  const isOutOfStock = stock <= 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setWishlistActive(!wishlistActive);
    if (onWishlistToggle) onWishlistToggle(product);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      const resultAction = await dispatch(addToCartThunk({ productId: product._id || product.id, quantity: 1 }));
      if (addToCartThunk.fulfilled.match(resultAction)) {
        toast.success(`${name} added to cart!`);
      } else {
        toast.error(resultAction.payload || 'Failed to add item to cart');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      onClick={() => navigate(`/mart/product/${product._id || product.id}`)}
      className={`bg-white border border-zinc-200 p-4 relative group flex flex-col justify-between cursor-pointer hover:border-black transition-colors duration-300 ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        {/* 1. MARKETING BADGES */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
          {isFeatured && <Badge variant="dark">Featured</Badge>}
          {isNewArrival && <Badge variant="info">New</Badge>}
          {isBestSeller && <Badge variant="success">Best Seller</Badge>}
          {discount > 0 && <Badge variant="danger">{discount}% OFF</Badge>}
          {isOutOfStock && <Badge variant="danger">Out of Stock</Badge>}
        </div>

        {/* 2. WISHLIST ACTION */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
          title="Add to Wishlist"
        >
          {wishlistActive ? (
            <IoHeart className="w-4 h-4 text-red-500" />
          ) : (
            <IoHeartOutline className="w-4 h-4" />
          )}
        </button>

        {/* 3. PRODUCT IMAGE & HOVER OVERLAY */}
        <div className="w-full h-40 overflow-hidden mb-4 bg-zinc-50 flex items-center justify-center relative">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          
          {/* Quick View Hover overlay action */}
          {!isOutOfStock && onQuickView && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="bg-white text-black text-[9px] tracking-widest font-semibold px-4 py-2 flex items-center gap-1.5 shadow-md hover:bg-black hover:text-white transition-colors duration-300 uppercase"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoEyeOutline className="w-3.5 h-3.5" />
                Quick View
              </motion.button>
            </div>
          )}
        </div>

        {/* 4. PRODUCT METADATA */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] tracking-wider text-zinc-400 uppercase font-light">
              {brand}
            </span>
            <div className="flex items-center gap-1 bg-zinc-50 px-1.5 py-0.5">
              <IoStar className="w-3 h-3 text-zinc-800" />
              <span className="text-[9px] font-semibold text-zinc-600 mt-0.5">{rating}</span>
            </div>
          </div>

          <h4 className="text-xs font-semibold tracking-wider text-black line-clamp-1 group-hover:text-zinc-600 transition-colors uppercase">
            {name}
          </h4>
          
          {/* Price grid */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-black">₹{price}</span>
            {mrp > price && (
              <span className="text-[10px] text-zinc-400 line-through">₹{mrp}</span>
            )}
          </div>
        </div>
      </div>

      {/* 5. ADD TO CART CTA */}
      <button
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`w-full mt-4 text-[10px] font-semibold tracking-widest py-2 transition-colors uppercase ${
          isOutOfStock
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-zinc-800'
        }`}
      >
        {isOutOfStock ? 'Sold Out' : 'Add To Cart'}
      </button>

    </motion.div>
  );
};

export default ProductCard;
