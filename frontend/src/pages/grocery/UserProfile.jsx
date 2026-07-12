import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile, addUserAddress, deleteUserAddress, logoutUser } from '../../redux/slices/authSlice.js';
import { fetchMyOrders } from '../../redux/slices/orderSlice.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { RowSkeleton } from '../../components/Loader.jsx';
import { IoLocationOutline, IoBagHandleOutline, IoLogOutOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, addresses, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

  // States
  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses, orders
  
  // Profile Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile()).then((action) => {
        if (fetchProfile.fulfilled.match(action)) {
          setName(action.payload.user?.name || '');
          setPhone(action.payload.user?.phone || '');
        }
      });
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please provide name and phone.');
      return;
    }

    const result = await dispatch(updateProfile({ name, phone }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!houseNumber) tempErrors.houseNumber = 'House Number is required';
    if (!street) tempErrors.street = 'Street is required';
    if (!city) tempErrors.city = 'City is required';
    if (!state) tempErrors.state = 'State is required';
    if (!zipCode) {
      tempErrors.zipCode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(zipCode)) {
      tempErrors.zipCode = 'Invalid Pincode (6 digits)';
    }

    if (Object.keys(tempErrors).length > 0) {
      setAddressErrors(tempErrors);
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
      toast.success('Address saved!');
      setShowAddressForm(false);
      setHouseNumber('');
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
    } else {
      toast.error('Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await dispatch(deleteUserAddress(id));
    if (deleteUserAddress.fulfilled.match(result)) {
      toast.success('Address removed.');
    } else {
      toast.error('Failed to remove address.');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully.');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Access Forbidden"
        description="Please log in to manage your customer profile settings."
        actionLabel="Sign In Now"
        onActionClick={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-4 flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Customer Dashboard</span>
          <h2 className="text-xl font-light tracking-wide mt-1 uppercase">{user?.name || 'My Profile'}</h2>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-[10px] tracking-widest font-semibold text-red-500 hover:text-red-700 uppercase"
        >
          <IoLogOutOutline className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Tabs (Sidebar) */}
        <aside className="space-y-1 border border-zinc-200 bg-white p-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider uppercase font-light transition-all ${
              activeTab === 'profile' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider uppercase font-light transition-all ${
              activeTab === 'addresses' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs tracking-wider uppercase font-light transition-all ${
              activeTab === 'orders' ? 'bg-black text-white' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Order History ({orders.length})
          </button>
        </aside>

        {/* Tab Contents (Main View) */}
        <div className="md:col-span-3">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="bg-white border border-zinc-200 p-6 space-y-4 max-w-lg">
              <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                Personal Information
              </h3>
              
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NAME"
                required
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                placeholder="EMAIL"
              />

              <Input
                label="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="PHONE"
                required
              />

              <div className="pt-2">
                <Button 
                  type="submit"
                  isLoading={authLoading}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              
              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr._id} className="bg-white border border-zinc-200 p-6 relative flex flex-col justify-between h-40">
                    <div className="space-y-1">
                      <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-light flex items-center gap-1">
                        <IoLocationOutline className="w-3.5 h-3.5" />
                        {addr.isDefault ? 'Default Address' : 'Shipping Address'}
                      </span>
                      <span className="text-xs font-semibold tracking-wider uppercase block truncate">{addr.street}</span>
                      <span className="text-[10px] text-zinc-500 font-light uppercase block">
                        {addr.city}, {addr.state} - {addr.zipCode}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-[9px] tracking-widest text-red-500 hover:text-red-700 uppercase font-semibold text-left mt-4 inline-flex items-center gap-1.5"
                    >
                      <IoTrashOutline className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Address Form Toggle */}
              {!showAddressForm ? (
                <Button 
                  icon={IoAddOutline}
                  onClick={() => setShowAddressForm(true)}
                >
                  Add New Address
                </Button>
              ) : (
                <form onSubmit={handleAddAddress} className="bg-white border border-zinc-200 p-6 space-y-4 max-w-lg">
                  <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
                    New Address Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Flat / House Number"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      error={addressErrors.houseNumber}
                      placeholder="E.G. FLAT 3B"
                      required
                    />
                    <Input
                      label="Street / Area"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      error={addressErrors.street}
                      placeholder="E.G. PARK AVENUE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      error={addressErrors.city}
                      placeholder="CITY"
                      required
                    />
                    <Input
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      error={addressErrors.state}
                      placeholder="STATE"
                      required
                    />
                    <Input
                      label="Pincode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      error={addressErrors.zipCode}
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

            </div>
          )}

          {/* TAB 3: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {ordersLoading && orders.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))
              ) : orders.length === 0 ? (
                <EmptyState
                  title="No Orders Placed Yet"
                  description="You have not purchased any items from Shree G Mart yet."
                  actionLabel="Browse Catalog"
                  onActionClick={() => navigate('/mart/products')}
                />
              ) : (
                orders.map((order) => (
                  <div 
                    key={order._id}
                    className="bg-white border border-zinc-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-black transition-colors"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold tracking-widest">{order.orderNumber}</span>
                        <Badge variant={order.orderStatus === 'Cancelled' ? 'danger' : 'dark'}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-light block">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                      </span>
                      <span className="text-xs font-semibold block pt-1">
                        Total Amount: ₹{order.totalAmount}
                      </span>
                    </div>

                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/mart/order-tracking/${order._id}`)}
                    >
                      Track Order
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UserProfile;
