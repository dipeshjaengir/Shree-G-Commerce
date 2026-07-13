import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCart, addToCartThunk, removeFromCartThunk } from '../../redux/slices/cartSlice.js';
import Button from '../../components/Button.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { IoAddOutline, IoRemoveOutline, IoTrashOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQty = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    
    const maxQty = 10;
    if (newQty > maxQty) {
      toast.error(`Maximum quantity limit is ${maxQty} units.`);
      return;
    }

    const result = await dispatch(addToCartThunk({ productId, quantity: newQty }));
    if (addToCartThunk.rejected.match(result)) {
      toast.error(result.payload || 'Insufficient stock to increase quantity.');
    }
  };

  const handleRemove = async (productId) => {
    const result = await dispatch(removeFromCartThunk(productId));
    if (removeFromCartThunk.fulfilled.match(result)) {
      toast.success('Product removed from cart.');
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Access Forbidden"
        description="Please log in to view and checkout items in your shopping cart."
        actionLabel="Sign In Now"
        onActionClick={() => navigate('/login')}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        description="You have not added any groceries to your cart yet. Explore the mart to shop fresh arrivals."
        actionLabel="Start Shopping"
        onActionClick={() => navigate('/mart')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">My Account</span>
        <h2 className="text-xl font-light tracking-wide mt-1">SHOPPING CART</h2>
        <span className="text-[10px] text-zinc-400 font-light tracking-wider uppercase mt-1 block">
          Review Items ({items.length})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* ==================== 1. CART ITEMS GRID (LEFT SIDE) ==================== */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;

            return (
              <div 
                key={prod._id || prod.id} 
                className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product Detail */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 p-2 flex items-center justify-center shrink-0">
                    <img 
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80'} 
                      alt={prod.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left space-y-1">
                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">
                      {prod.brand} • {prod.attributes?.weight || prod.unit}
                    </span>
                    <Link to={`/mart/product/${prod._id || prod.id}`} className="text-xs font-semibold tracking-wider hover:text-zinc-500 uppercase line-clamp-1">
                      {prod.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">₹{prod.price}</span>
                      {prod.mrp > prod.price && (
                        <span className="text-[10px] text-zinc-400 line-through">₹{prod.mrp}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Delete action */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-zinc-200 bg-[#F8F8F8] h-9">
                    <button 
                      onClick={() => handleUpdateQty(prod._id || prod.id, item.quantity, -1)}
                      className="w-8 h-full flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
                    >
                      <IoRemoveOutline className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQty(prod._id || prod.id, item.quantity, 1)}
                      className="w-8 h-full flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
                    >
                      <IoAddOutline className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <span className="text-xs font-semibold w-16 text-right">
                    ₹{prod.price * item.quantity}
                  </span>

                  {/* Delete button */}
                  <button 
                    onClick={() => handleRemove(prod._id || prod.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove from Cart"
                  >
                    <IoTrashOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== 2. ORDER SUMMARY PANEL (RIGHT SIDE) ==================== */}
        <div className="bg-white border border-zinc-200 p-6 space-y-6">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-3">
            Order Summary
          </h3>
          
          <div className="space-y-3 text-[11px] tracking-wider font-light">
            <div className="flex justify-between">
              <span className="text-zinc-400 uppercase">Subtotal</span>
              <span className="text-black font-semibold">₹{subtotal}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span className="uppercase">Discount Savings</span>
                <span className="font-semibold">-₹{discountAmount}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-zinc-400 uppercase">Delivery Fee</span>
              <span className="text-black font-semibold">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[9px] text-zinc-400 font-light text-right leading-none">
                Add ₹{500 - subtotal} more for FREE delivery
              </p>
            )}

            <hr className="border-zinc-100" />
            
            <div className="flex justify-between text-xs font-semibold">
              <span className="uppercase text-black">Estimated Total</span>
              <span className="text-black">₹{totalAmount}</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/mart/checkout')}
            className="w-full pt-3"
          >
            PROCEED TO CHECKOUT
          </Button>

          <div className="text-center pt-2">
            <Link 
              to="/mart/products" 
              className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-light border-b border-zinc-200 hover:border-black transition-all pb-0.5"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
