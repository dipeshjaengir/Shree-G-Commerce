import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  description: { type: String, trim: true },
  image: { type: String, default: '' },
  module: {
    type: String,
    required: true,
    enum: ['grocery', 'clothing'],
    index: true
  },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date }
}, { timestamps: true });

// Soft delete query middleware
CategorySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
