import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  // Identity
  storeName: { type: String, required: true, default: 'Shree G Mart' },
  storeLogo: { type: String, default: '' },
  storeDescription: { type: String, default: 'Your Premium Neighborhood Grocery Supermarket.' },
  
  // Contacts
  contactNumber: { type: String, default: '+919999999999' },
  supportEmail: { type: String, default: 'support@shreegcommerce.com' },
  whatsAppNumber: { type: String, default: '+919999999999' },
  
  // Address & Hours
  storeAddress: { type: String, default: '123 Corporate Tower, BKC, Mumbai, Maharashtra' },
  googleMapsLink: { type: String, default: 'https://maps.google.com' },
  businessHours: { type: String, default: '09:00 AM - 09:00 PM' },
  
  // Social Links
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  
  // Financials & Billing
  currencySymbol: { type: String, default: '₹' },
  gstPercentage: { type: Number, required: true, default: 18 },
  deliveryCharge: { type: Number, required: true, default: 40 },
  freeDeliveryLimit: { type: Number, required: true, default: 500 },
  orderPrefix: { type: String, default: 'SG' },
  invoiceFooter: { type: String, default: 'Thank you for shopping with Shree G!' },
  
  // Operational States
  maintenanceMode: { type: Boolean, default: false },
  isStoreOpen: { type: Boolean, default: true },
  
  // System Configurations (RBAC & security)
  inventoryDeductionTrigger: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Delivered'],
    default: 'Delivered'
  },
  failedLoginAttemptsLimit: { type: Number, default: 5 },
  lockoutDurationMinutes: { type: Number, default: 15 }
}, { timestamps: true });

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
