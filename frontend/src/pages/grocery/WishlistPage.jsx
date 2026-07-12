import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, removeFromWishlistThunk } from '../../redux/slices/wishlistSlice.js';
import { addToCartThunk } from '../../redux/slices/cartSlice.js';
import ProductCard from '../../components/ProductCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { CardSkeleton } from '../../components/Loader.jsx';
import { toast } from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (id) => {
    const result = await dispatch(removeFromWishlistThunk(id));
    if (removeFromWishlistThunk.fulfilled.match(result)) {
      toast.success('Removed from wishlist.');
    }
  };

  const handleMoveToCart = async (product) => {
    if (product.stock <= 0) {
      toast.error('Item is currently out of stock.');
      return;
    }

    // 1. Add to cart
    const cartResult = await dispatch(addToCartThunk({ productId: product._id || product.id, quantity: 1 }));
    if (addToCartThunk.fulfilled.match(cartResult)) {
      // 2. Remove from wishlist
      await dispatch(removeFromWishlistThunk(product._id || product.id));
      toast.success('Moved to cart!');
    } else {
      toast.error(cartResult.payload || 'Failed to add to cart.');
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Access Forbidden"
        description="Please log in to view and manage your personal wishlist."
        actionLabel="Sign In Now"
        onActionClick={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">My Account</span>
        <h2 className="text-xl font-light tracking-wide mt-1">WISHLIST</h2>
        <span className="text-[10px] text-zinc-400 font-light tracking-wider uppercase mt-1 block">
          Saved Items ({products.length})
        </span>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Wishlist is Empty"
          description="You haven't saved any groceries yet. Explore the mart to save favorites."
          actionLabel="Go To Mart"
          onActionClick={() => navigate('/mart')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod._id || prod.id} className="relative group">
              <ProductCard
                product={prod}
                isWishlisted={true}
                onWishlistToggle={() => handleRemove(prod._id || prod.id)}
              />
              <div className="p-2 bg-zinc-50 border-x border-b border-zinc-200 flex justify-between gap-2 mt-[-1px]">
                <button
                  onClick={() => handleRemove(prod._id || prod.id)}
                  className="text-[9px] tracking-widest text-zinc-400 hover:text-red-500 uppercase font-light transition-colors py-1 flex-1 text-center"
                >
                  Delete
                </button>
                <div className="w-[1px] bg-zinc-200"></div>
                <button
                  disabled={prod.stock <= 0}
                  onClick={() => handleMoveToCart(prod)}
                  className={`text-[9px] tracking-widest uppercase font-semibold py-1 flex-1 text-center ${
                    prod.stock <= 0 ? 'text-zinc-300 cursor-not-allowed' : 'text-black hover:text-zinc-600'
                  }`}
                >
                  Move To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
