import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerSnapshot: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    weight: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],
  shippingAddress: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    mobileNumber: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay', 'Stripe'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Placed',
    index: true
  },
  
  // Financial breakdown
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  
  // Dynamic order tracking history
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    remarks: { type: String }
  }],

  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date }
}, { timestamps: true });

// Soft delete query middleware
OrderSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
