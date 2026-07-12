import React, { useState, useEffect } from 'react';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { adminService } from '../../services/adminService.js';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  // Identity
  const [storeName, setStoreName] = useState('Shree G Mart');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  
  // Contacts
  const [contactNumber, setContactNumber] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  
  // Hours & Maps
  const [storeAddress, setStoreAddress] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  
  // Socials
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  
  // Financials & Billing
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [gstPercentage, setGstPercentage] = useState('18');
  const [deliveryCharge, setDeliveryCharge] = useState('40');
  const [freeDeliveryLimit, setFreeDeliveryLimit] = useState('500');
  const [orderPrefix, setOrderPrefix] = useState('SG');
  const [invoiceFooter, setInvoiceFooter] = useState('');
  
  // Operational States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [inventoryDeductionTrigger, setInventoryDeductionTrigger] = useState('Delivered');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminService.getSystemSettings();
        const settings = res.data.settings;
        if (settings) {
          setStoreName(settings.storeName || '');
          setStoreLogo(settings.storeLogo || '');
          setStoreDescription(settings.storeDescription || '');
          setContactNumber(settings.contactNumber || '');
          setSupportEmail(settings.supportEmail || '');
          setWhatsAppNumber(settings.whatsAppNumber || '');
          setStoreAddress(settings.storeAddress || '');
          setGoogleMapsLink(settings.googleMapsLink || '');
          setBusinessHours(settings.businessHours || '');
          setFacebook(settings.facebook || '');
          setInstagram(settings.instagram || '');
          setCurrencySymbol(settings.currencySymbol || '₹');
          setGstPercentage(settings.gstPercentage?.toString() || '18');
          setDeliveryCharge(settings.deliveryCharge?.toString() || '40');
          setFreeDeliveryLimit(settings.freeDeliveryLimit?.toString() || '500');
          setOrderPrefix(settings.orderPrefix || 'SG');
          setInvoiceFooter(settings.invoiceFooter || '');
          setMaintenanceMode(settings.maintenanceMode || false);
          setIsStoreOpen(settings.isStoreOpen !== false);
          setInventoryDeductionTrigger(settings.inventoryDeductionTrigger || 'Delivered');
        }
      } catch (err) {
        toast.error('Failed to load system settings.');
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updateSystemSettings({
        storeName,
        storeLogo,
        storeDescription,
        contactNumber,
        supportEmail,
        whatsAppNumber,
        storeAddress,
        googleMapsLink,
        businessHours,
        facebook,
        instagram,
        currencySymbol,
        gstPercentage: Number(gstPercentage),
        deliveryCharge: Number(deliveryCharge),
        freeDeliveryLimit: Number(freeDeliveryLimit),
        orderPrefix,
        invoiceFooter,
        maintenanceMode,
        isStoreOpen,
        inventoryDeductionTrigger
      });
      toast.success('System settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto pb-10">
      
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase">System Configurations</h2>
        <span className="text-[10px] text-zinc-400 font-light tracking-wider mt-1 block">
          Manage corporate parameters, billing matrices, and maintenance triggers
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: STORE IDENTITY */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            1. Store Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Store Brand Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="STORE NAME"
              required
            />
            <Input
              label="Store Logo URL"
              value={storeLogo}
              onChange={(e) => setStoreLogo(e.target.value)}
              placeholder="LOGO LINK"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Store Description</span>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="DESCRIPTION"
              rows={2}
              className="w-full p-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none resize-none font-light"
            />
          </div>
        </div>

        {/* SECTION 2: CONTACT INFORMATION */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            2. Contact & Customer Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Support Phone Contact"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="PHONE"
            />
            <Input
              label="Support Email Address"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="EMAIL"
            />
            <Input
              label="WhatsApp Business Contact"
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              placeholder="WHATSAPP NUMBER"
            />
          </div>
        </div>

        {/* SECTION 3: ADDRESS & OPERATIONAL HOURS */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            3. Address & Working Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Hours"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              placeholder="E.G. 09:00 AM - 09:00 PM"
            />
            <Input
              label="Google Maps URL Coordinates"
              value={googleMapsLink}
              onChange={(e) => setGoogleMapsLink(e.target.value)}
              placeholder="MAPS LINK"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">Physical Address</span>
            <textarea
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="STORE ADDRESS"
              rows={2}
              className="w-full p-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none resize-none font-light"
            />
          </div>
        </div>

        {/* SECTION 4: SOCIAL LINKS */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            4. Social Media Mappings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Facebook Link"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="LINK"
            />
            <Input
              label="Instagram Link"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="LINK"
            />
          </div>
        </div>

        {/* SECTION 5: FINANCIALS & BILLING */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            5. Billing, Tax & Pricing rules
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Currency Sign"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              placeholder="SYMBOL"
              required
            />
            <Input
              label="GST Percentage (%)"
              type="number"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(e.target.value)}
              placeholder="GST"
              required
            />
            <Input
              label="Surcharge delivery"
              type="number"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              placeholder="DELIVERY FEE"
              required
            />
            <Input
              label="Free shipping cap"
              type="number"
              value={freeDeliveryLimit}
              onChange={(e) => setFreeDeliveryLimit(e.target.value)}
              placeholder="THRESHOLD"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Invoice Number Prefix"
              value={orderPrefix}
              onChange={(e) => setOrderPrefix(e.target.value)}
              placeholder="PREFIX"
              required
            />
            <Input
              label="Invoice Footer Surcharge Remarks"
              value={invoiceFooter}
              onChange={(e) => setInvoiceFooter(e.target.value)}
              placeholder="REMARKS"
            />
          </div>
        </div>

        {/* SECTION 6: OPERATIONAL STATES */}
        <div className="bg-white border border-zinc-200 p-6 space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
            6. System Operational Statuses
          </h3>
          
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-light">
              Inventory Stock Deduction Trigger
            </span>
            <select
              value={inventoryDeductionTrigger}
              onChange={(e) => setInventoryDeductionTrigger(e.target.value)}
              className="w-full h-10 px-4 text-xs tracking-wider border border-zinc-200 focus:border-black bg-white rounded-none outline-none font-semibold uppercase"
            >
              <option value="Placed">Deduct immediately when order is Placed</option>
              <option value="Confirmed">Deduct only when order is Confirmed</option>
              <option value="Packed">Deduct only when order is Packed</option>
              <option value="Delivered">Deduct permanently only when order is Delivered</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="accent-black"
              />
              <span className="uppercase text-[10px] tracking-wider mt-0.5 font-semibold text-red-500">Enable Maintenance Mode</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={isStoreOpen}
                onChange={(e) => setIsStoreOpen(e.target.checked)}
                className="accent-black"
              />
              <span className="uppercase text-[10px] tracking-wider mt-0.5 font-semibold">Store Status (Open / Closed)</span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full pt-3"
        >
          Save All System Configurations
        </Button>

      </form>
    </div>
  );
};

export default SettingsPage;
