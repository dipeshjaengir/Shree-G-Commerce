import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true // E.g., 'PRODUCT_CREATED', 'PRICE_CHANGED', 'ORDER_UPDATED'
  },
  entityType: {
    type: String,
    required: true // E.g., 'Product', 'Order', 'User'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  previousState: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newState: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

AuditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export default AuditLog;
