import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoEyeOutline, IoStar } from 'react-icons/io5';
import Badge from './Badge.jsx';

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

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setWishlistActive(!wishlistActive);
    if (onWishlistToggle) {
      onWishlistToggle(product._id || product.id);
    }
  };

  return (
    <motion.div
      className={`bg-white border border-zinc-200 p-4 flex flex-col justify-between relative group hover:border-black transition-colors duration-300 ${className}`}
      whileHover={{ y: -2 }}
    >
      {/* 1. BADGES (Featured, New, Best Seller) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
        {isBestSeller && <Badge variant="dark">Best Seller</Badge>}
        {isNewArrival && <Badge variant="dark">New</Badge>}
        {isFeatured && <Badge variant="outline">Featured</Badge>}
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
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
        />
        
        {/* Quick View Hover overlay action */}
        {!isOutOfStock && onQuickView && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <motion.button
              onClick={() => onQuickView(product)}
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

      {/* 4. PRODUCT INFO */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">
            {brand || 'Generic'} • {unit}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-0.5 text-yellow-400">
            <IoStar className="w-3 h-3" />
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

      {/* 5. ADD TO CART CTA (UI Only) */}
      <button
        disabled={isOutOfStock}
        onClick={(e) => {
          e.stopPropagation();
          alert(`${name} added to cart (UI Interaction only)`);
        }}
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
