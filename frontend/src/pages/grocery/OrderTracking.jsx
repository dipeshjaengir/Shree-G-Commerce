import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, cancelOrderThunk } from '../../redux/slices/orderSlice.js';
import { PageLoader } from '../../components/Loader.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import { IoCheckmarkCircle, IoCloseCircle, IoArrowBackOutline, IoPrintOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

const ORDER_STEPS = ['Placed', 'Confirmed', 'Packed', 'Out For Delivery', 'Delivered'];

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      const result = await dispatch(cancelOrderThunk(id));
      if (cancelOrderThunk.fulfilled.match(result)) {
        toast.success('Order cancelled successfully!');
      } else {
        toast.error(result.payload || 'Failed to cancel order.');
      }
    }
  };

  if (loading && !currentOrder) {
    return <PageLoader />;
  }

  if (error || !currentOrder) {
    return (
      <div className="text-center py-20">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-red-500">Error Loading Order</h2>
        <p className="text-xs text-zinc-500 mt-2 font-light">{error || 'Order details not found.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/mart/profile')} className="mt-6">
          Back to Profile
        </Button>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(currentOrder.orderStatus);
  const isCancelled = currentOrder.orderStatus === 'Cancelled';
  const isReturned = currentOrder.orderStatus === 'Returned';
  const canCancel = ['Placed', 'Confirmed'].includes(currentOrder.orderStatus);

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      
      {/* Back navigation header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <button 
          onClick={() => navigate('/mart/profile')}
          className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors duration-300 text-xs tracking-widest font-light group"
        >
          <IoArrowBackOutline className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          MY DASHBOARD
        </button>
        <button 
          onClick={() => alert('Invoice PDF download placeholder triggered.')}
          className="flex items-center gap-1.5 text-[10px] tracking-widest font-semibold text-zinc-500 hover:text-black uppercase"
          title="Print Invoice"
        >
          <IoPrintOutline className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* 1. ORDER SUMMARY CARD */}
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light">Order Reference</span>
            <h3 className="text-sm font-semibold tracking-wider text-black">{currentOrder.orderNumber}</h3>
          </div>
          <Badge variant={isCancelled ? 'danger' : isReturned ? 'warning' : 'dark'}>
            {currentOrder.orderStatus}
          </Badge>
        </div>
        <p className="text-[10px] text-zinc-400 font-light tracking-wider">
          Placed on: {new Date(currentOrder.createdAt).toLocaleString()}
        </p>
      </div>

      {/* 2. ORDER PROGRESS TRACKING STEPPER */}
      {!isCancelled && !isReturned && (
        <div className="bg-white border border-zinc-200 p-6 space-y-6">
          <h4 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light border-b border-zinc-100 pb-2">
            Delivery Progress
          </h4>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
            {/* Stepper bar connector */}
            <div className="absolute left-[15px] top-6 bottom-6 md:left-4 md:right-4 md:top-[15px] md:h-[2px] bg-zinc-100 -z-0"></div>
            
            {ORDER_STEPS.map((step, idx) => {
              const completed = idx <= currentStepIndex;
              const active = idx === currentStepIndex;
              return (
                <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-semibold text-xs transition-all duration-500 ${
                    completed 
                      ? 'bg-black border-black text-white' 
                      : 'bg-white border-zinc-200 text-zinc-300'
                  }`}>
                    {completed ? <IoCheckmarkCircle className="w-5 h-5 text-white animate-pulse" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] tracking-widest uppercase font-semibold ${
                    active ? 'text-black' : completed ? 'text-zinc-500' : 'text-zinc-300'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exception view (For cancelled or returned) */}
      {(isCancelled || isReturned) && (
        <div className="bg-red-50/20 border border-red-200/50 p-6 flex items-center gap-4 text-left">
          <IoCloseCircle className="w-10 h-10 text-red-500 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-red-600 uppercase tracking-widest">
              {isCancelled ? 'Order Cancelled' : 'Order Returned'}
            </h4>
            <p className="text-[11px] font-light text-zinc-500 leading-relaxed">
              {isCancelled 
                ? 'This order has been cancelled by the customer. Stock levels were returned.' 
                : 'This order was marked as returned. Refund/receipt will process.'}
            </p>
          </div>
        </div>
      )}

      {/* 3. SNAPSHOTTED ITEMS */}
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <h4 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light border-b border-zinc-100 pb-2">
          Locked Items Snapshot
        </h4>
        <div className="divide-y divide-zinc-100">
          {currentOrder.items.map((item) => (
            <div key={item._id} className="py-3 flex justify-between items-center text-xs tracking-wider">
              <div className="flex flex-col text-left">
                <span className="font-semibold text-black uppercase">{item.name}</span>
                <span className="text-[9px] text-zinc-400 font-light mt-0.5">
                  {item.brand} • {item.weight} x{item.quantity}
                </span>
              </div>
              <span className="font-semibold text-black">₹{item.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BILLING BREAKDOWN */}
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <h4 className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase font-light border-b border-zinc-100 pb-2">
          Payment Breakdown
        </h4>
        <div className="space-y-2.5 text-[11px] tracking-wider font-light">
          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase">Subtotal</span>
            <span className="text-black font-semibold">₹{currentOrder.subtotal}</span>
          </div>
          {currentOrder.discountAmount > 0 && (
            <div className="flex justify-between text-red-500">
              <span className="uppercase">Discount</span>
              <span className="font-semibold">-₹{currentOrder.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase">Estimated GST</span>
            <span className="text-zinc-500">₹{currentOrder.taxAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase">Delivery Fee</span>
            <span className="text-black font-semibold">
              {currentOrder.shippingFee === 0 ? 'FREE' : `₹${currentOrder.shippingFee}`}
            </span>
          </div>
          <hr className="border-zinc-100" />
          <div className="flex justify-between text-xs font-semibold">
            <span className="uppercase text-black">Paid via {currentOrder.paymentMethod}</span>
            <span className="text-black">₹{currentOrder.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* 5. CANCELLATION TRIGGER ACTION */}
      {canCancel && (
        <div className="pt-2 text-right">
          <button
            onClick={handleCancelOrder}
            className="text-[10px] tracking-widest font-semibold text-red-500 hover:text-red-700 hover:underline uppercase transition-all"
          >
            Cancel Order
          </button>
        </div>
      )}

    </div>
  );
};

export default OrderTracking;
