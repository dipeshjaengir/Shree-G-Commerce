import Settings from '../models/Settings.js';
import { logger } from '../utils/logger.js';

let cachedSettings = null;

export const initializeSettings = async () => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        storeName: 'Shree G Mart',
        storeLogo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80',
        storeDescription: 'Your Premium Neighborhood Grocery Supermarket.',
        contactNumber: '+919999999999',
        supportEmail: 'support@shreegcommerce.com',
        whatsAppNumber: '+919999999999',
        storeAddress: '123 Corporate Tower, BKC, Mumbai, Maharashtra',
        googleMapsLink: 'https://maps.google.com',
        businessHours: '09:00 AM - 09:00 PM',
        facebook: 'https://facebook.com/shreegmart',
        instagram: 'https://instagram.com/shreegmart',
        currencySymbol: '₹',
        gstPercentage: 18,
        deliveryCharge: 40,
        freeDeliveryLimit: 500,
        orderPrefix: 'SG',
        invoiceFooter: 'Thank you for shopping with Shree G!',
        maintenanceMode: false,
        isStoreOpen: true,
        inventoryDeductionTrigger: 'Delivered',
        failedLoginAttemptsLimit: 5,
        lockoutDurationMinutes: 15
      });
      await settings.save();
      logger.info('Default Store Settings bootstrapped in database.');
    }
    cachedSettings = settings.toObject();
    logger.info('Store Settings cache initialized successfully.');
  } catch (error) {
    logger.error(`Error initializing Store Settings: ${error.message}`);
  }
};

export const getSettings = async (forceRefresh = false) => {
  if (!cachedSettings || forceRefresh) {
    const settings = await Settings.findOne();
    if (settings) {
      cachedSettings = settings.toObject();
    }
  }
  return cachedSettings;
};

export const updateSettings = async (newSettingsData, adminId, req) => {
  const settings = await Settings.findOne();
  if (!settings) {
    throw new Error('Settings not initialized.');
  }

  const previousState = settings.toObject();
  
  // Update fields dynamically
  Object.assign(settings, newSettingsData);
  await settings.save();

  cachedSettings = settings.toObject();
  
  // Return states for logging
  return { previousState, newState: cachedSettings };
};
