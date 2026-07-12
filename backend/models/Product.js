import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: { type: String, required: true, trim: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true, index: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0, index: true },
  stock: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true, index: true },
  brand: { type: String, trim: true, index: true },
  module: {
    type: String,
    required: true,
    enum: ['grocery', 'clothing'],
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  
  // Marketing badges
  isFeatured: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false, index: true },

  // Modular dynamic attributes (e.g. weight/unit, size/color arrays)
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date }
}, { timestamps: true });

// Auto index for text searches (name, brand, description)
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });

// Soft delete query middleware
ProductSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
