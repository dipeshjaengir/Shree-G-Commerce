import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircleOutline, IoLocationOutline, IoAddOutline, IoCardOutline } from 'react-icons/io5';
import { fetchCart } from '../../redux/slices/cartSlice.js';
import { fetchProfile, addUserAddress } from '../../redux/slices/authSlice.js';
import { placeOrder } from '../../redux/slices/orderSlice.js';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { toast } from 'react-hot-toast';

const Steps = {
  ADDRESS: 'address',
  SUMMARY: 'summary',
  CONFIRM: 'confirm',
  SUCCESS: 'success'
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, discountAmount, shippingFee, totalAmount } = useSelector((state) => state.cart);
  const { addresses, isAuthenticated } = useSelector((state) => state.auth);
  const { currentOrder, loading: orderLoading } = useSelector((state) => state.orders);

  // States
  const [activeStep, setActiveStep] = useState(Steps.ADDRESS);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address Form States
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchProfile()).then((action) => {
        if (fetchProfile.fulfilled.match(action)) {
          const defaultAddr = action.payload.addresses?.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (action.payload.addresses?.length > 0) {
            setSelectedAddressId(action.payload.addresses[0]._id);
          }
        }
      });
    }
  }, [dispatch, isAuthenticated]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!houseNumber) tempErrors.houseNumber = 'House Number is required';
    if (!street) tempErrors.street = 'Street / Area is required';
    if (!city) tempErrors.city = 'City is required';
    if (!state) tempErrors.state = 'State is required';
    if (!zipCode) {
      tempErrors.zipCode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(zipCode)) {
      tempErrors.zipCode = 'Invalid Pincode (6 digits required)';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const fullStreetAddress = `${houseNumber}, ${street}`;
    const result = await dispatch(addUserAddress({
      street: fullStreetAddress,
      city,
      state,
      zipCode,
      country: 'India',
      isDefault: addresses.length === 0
    }));

    if (addUserAddress.fulfilled.match(result)) {
      toast.success('Address added successfully!');
      setSelectedAddressId(result.payload._id);
      setShowAddressForm(false);
      // Reset form
      setHouseNumber('');
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
    } else {
      toast.error('Failed to add address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address.');
      return;
    }

    const result = await dispatch(placeOrder({
      addressId: selectedAddressId,
      paymentMethod: 'COD'
    }));

    if (placeOrder.fulfilled.match(result)) {
      toast.success('Order placed successfully!');
      setActiveStep(Steps.SUCCESS);
    } else {
      toast.error(result.payload || 'Overselling prevented. Insufficient stock.');
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Access Forbidden"
        description="Please log in to proceed to checkout."
        actionLabel="Sign In Now"
        onActionClick={() => navigate('/login')}
      />
    );
  }

  if (items.length === 0 && activeStep !== Steps.SUCCESS) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        description="You have no items in your cart to checkout."
        actionLabel="Go To Mart"
        onActionClick={() => navigate('/mart')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {/* 1. CHECKOUT HEADER PROGRESS */}
      {activeStep !== Steps.SUCCESS && (
        <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Checkout</span>
            <h2 className="text-xl font-light tracking-wide mt-1">
              {activeStep === Steps.ADDRESS && "SELECT SHIPPING ADDRESS"}
              {activeStep === Steps.SUMMARY && "ORDER SUMMARY & COD"}
            </h2>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex gap-2 text-[9px] tracking-widest uppercase font-semibold">
            <span className={activeStep === Steps.ADDRESS ? 'text-black border-b border-black pb-0.5' : 'text-zinc-300'}>
              1. Address
            </span>
            <span className="text-zinc-300">/</span>
            <span className={activeStep === Steps.SUMMARY ? 'text-black border-b border-black pb-0.5' : 'text-zinc-300'}>
              2. Summary
            </span>
          </div>
        </div>
      )}

      {/* 2. STEPS SWITCHBOARD CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* LEFT COLUMN: ACTIVE STEP VIEWS */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ADDRESS SELECTION */}
            {activeStep === Steps.ADDRESS && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* Saved addresses lists */}
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-xs text-zinc-500 font-light italic">
                      No saved addresses. Please add a shipping address below.
                    </p>
                  ) : (
                    addresses.map((addr) => (
                      <label 
                        key={addr._id}
                        className={`flex items-start gap-4 p-4 border cursor-pointer bg-white transition-all ${
                          selectedAddressId === addr._id 
                            ? 'border-black shadow-md' 
                            : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="accent-black mt-1"
                        />
                        <div className="flex flex-col text-left space-y-1">
                          <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light flex items-center gap-1">
                            <IoLocationOutline className="w-3.5 h-3.5" />
                            {addr.isDefault ? 'Default Address' : 'Shipping Address'}
                          </span>
                          <span className="text-xs font-semibold tracking-wider uppercase">{addr.street}</span>
                          <span className="text-[11px] font-light text-zinc-500 uppercase">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                {/* Add Address Form Toggle */}
                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-xs tracking-widest font-semibold text-black hover:text-zinc-600 transition-colors uppercase pt-2"
                  >
                    <IoAddOutline className="w-4 h-4" />
                    Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} className="bg-white border border-zinc-200 p-6 space-y-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                      New Shipping Address
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Flat / House Number"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        error={errors.houseNumber}
                        placeholder="E.G. FLAT 3B"
                        required
                      />
                      <Input
                        label="Street & Area"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        error={errors.street}
                        placeholder="E.G. PARK CIRCLE"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        error={errors.city}
                        placeholder="CITY"
                        required
                      />
                      <Input
                        label="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        error={errors.state}
                        placeholder="STATE"
                        required
                      />
                      <Input
                        label="Pincode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        error={errors.zipCode}
                        placeholder="6 DIGITS"
                        required
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        size="sm"
                      >
                        Save Address
                      </Button>
                    </div>
                  </form>
                )}

                {/* Continue CTA */}
                {addresses.length > 0 && (
                  <div className="pt-4">
                    <Button 
                      onClick={() => setActiveStep(Steps.SUMMARY)}
                      disabled={!selectedAddressId}
                    >
                      Continue to Summary
                    </Button>
                  </div>
                )}

              </motion.div>
            )}

            {/* STEP 2: SUMMARY & COD */}
            {activeStep === Steps.SUMMARY && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Selected Address Snapshot Card */}
                <div className="bg-white border border-zinc-200 p-6 space-y-3">
                  <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                    Shipping Details
                  </h3>
                  {addresses.filter(a => a._id === selectedAddressId).map(addr => (
                    <div key={addr._id} className="text-xs space-y-1">
                      <span className="font-semibold block uppercase">{addr.street}</span>
                      <span className="font-light text-zinc-500 uppercase">
                        {addr.city}, {addr.state} - {addr.zipCode}
                      </span>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveStep(Steps.ADDRESS)}
                    className="text-[9px] tracking-widest font-semibold text-zinc-400 hover:text-black uppercase border-b border-zinc-200 hover:border-black transition-all"
                  >
                    Change Shipping Address
                  </button>
                </div>

                {/* Payment Gateway Select strategy */}
                <div className="bg-white border border-zinc-200 p-6 space-y-3">
                  <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                    Payment Method
                  </h3>
                  <label className="flex items-center gap-4 p-4 border border-black bg-zinc-50/50 cursor-pointer">
                    <input type="radio" checked readOnly className="accent-black" />
                    <div className="flex items-center gap-3">
                      <IoCardOutline className="w-5 h-5" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold tracking-wider uppercase">Cash on Delivery (COD)</span>
                        <span className="text-[9px] text-zinc-400 font-light">Pay cash or scan QR at your doorstep upon delivery.</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Action Binds */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveStep(Steps.ADDRESS)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    isLoading={orderLoading}
                    className="flex-1"
                  >
                    CONFIRM & PLACE ORDER (COD)
                  </Button>
                </div>

              </motion.div>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {activeStep === Steps.SUCCESS && currentOrder && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="col-span-3 text-center space-y-8 py-10 bg-white border border-zinc-200 max-w-xl mx-auto px-8"
              >
                {/* Big Animated Success Check */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto"
                >
                  <IoCheckmarkCircleOutline className="w-10 h-10" />
                </motion.div>

                {/* Summary Info */}
                <div className="space-y-3">
                  <span className="text-[10px] tracking-[0.4em] text-green-600 uppercase font-semibold block">Order Confirmed</span>
                  <h2 className="text-xl font-light tracking-wider">THANK YOU FOR YOUR PURCHASE</h2>
                  
                  {/* Order Number */}
                  <div className="bg-[#F8F8F8] border border-zinc-100 p-4 max-w-xs mx-auto space-y-1">
                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light block">Order Number</span>
                    <span className="text-sm font-semibold tracking-widest text-black">{currentOrder.orderNumber}</span>
                  </div>
                  
                  <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto leading-relaxed pt-2">
                    A snapshot invoice was locked. Your order will be delivered to your saved pincode in 2-3 business days.
                  </p>
                </div>

                <div className="flex gap-4 max-w-sm mx-auto pt-4">
                  <Button 
                    variant="outline" 
                    className="w-1/2" 
                    onClick={() => navigate('/mart')}
                  >
                    Back to Store
                  </Button>
                  <Button 
                    className="w-1/2" 
                    onClick={() => navigate(`/mart/profile`)}
                  >
                    Track Status
                  </Button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: MINI ORDER INVOICE TOTALS (HIDDEN ON SUCCESS STEP) */}
        {activeStep !== Steps.SUCCESS && (
          <div className="bg-white border border-zinc-200 p-6 space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-3">
              Order Summary
            </h3>
            
            {/* Short items summary list */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product?._id} className="flex justify-between items-center text-[10px] tracking-wider font-light">
                  <span className="text-zinc-600 truncate max-w-[150px] uppercase">
                    {item.product?.name} x{item.quantity}
                  </span>
                  <span className="font-semibold text-black">
                    ₹{item.product?.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-zinc-100" />

            {/* Financial summary */}
            <div className="space-y-2 text-[10px] tracking-wider font-light">
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase">Subtotal</span>
                <span className="text-black font-semibold">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span className="uppercase">Discount</span>
                  <span className="font-semibold">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase">Delivery</span>
                <span className="text-black font-semibold">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <hr className="border-zinc-100" />
              <div className="flex justify-between text-xs font-semibold">
                <span className="uppercase text-black">Final Amount</span>
                <span className="text-black">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default CheckoutPage;
