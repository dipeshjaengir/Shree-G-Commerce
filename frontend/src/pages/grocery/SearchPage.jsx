import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import { CardSkeleton } from '../../components/Loader.jsx';
import { MOCK_PRODUCTS } from '../../utils/mockData.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartThunk } from '../../redux/slices/cartSlice.js';
import { toast } from 'react-hot-toast';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryParam = searchParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  // Modal State for Quick View
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!queryParam.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      const lower = queryParam.toLowerCase();
      const filtered = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.brand.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
      setResults(filtered);
      setIsLoading(false);
    }, 450); // Simulate network query latency

    return () => clearTimeout(timer);
  }, [queryParam]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Search Header */}
      <div className="border-b border-zinc-200 pb-4 text-left">
        <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Search Results</span>
        <h2 className="text-xl font-light tracking-wide mt-1">
          {queryParam.trim() ? (
            <>RESULTS FOR "<span className="font-semibold uppercase">{queryParam}</span>"</>
          ) : (
            "ENTER SEARCH QUERY"
          )}
        </h2>
        <span className="text-[10px] text-zinc-400 font-light tracking-wider uppercase mt-1 block">
          Found {results.length} matching items
        </span>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title="No Matching Groceries Found"
          description={`We couldn't find any groceries matching "${queryParam}". Try checking spelling or search for "basmati" or "oil" or "fresh".`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
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

export default SearchPage;
