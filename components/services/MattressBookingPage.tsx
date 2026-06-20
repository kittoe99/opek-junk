import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, BedDouble, Calendar, User, Phone, Mail, Home } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../../lib/supabase';
import { TrustBadges } from '../TrustBadges';

type MattressType = 'Mattress Only' | 'Mattress + Box Spring' | 'Full Set';

export const MattressBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is success
  
  // Step 1: Zip
  const [zipCode, setZipCode] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  
  // Step 2: Type
  const [selectedType, setSelectedType] = useState<MattressType | null>(null);

  // Step 3: Details
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setZipError(null);
    setZipLoading(true);
    // Simulate ZIP check (all US ZIPs supported)
    await new Promise(resolve => setTimeout(resolve, 800));
    setZipLoading(false);
    setStep(2);
  };

  const handleTypeSelect = (type: MattressType) => {
    setSelectedType(type);
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      const bookingDetails = {
        service_type: 'Mattress Disposal',
        items: [{ name: selectedType, quantity: 1 }],
        preferred_date: formData.date
      };

      const locationInfo = {
        address: formData.address,
        zip_code: zipCode
      };

      const { error } = await supabase
        .from('bookings')
        .insert([{
          order_number: generatedOrderNumber,
          customer_info: customerInfo,
          location_info: locationInfo,
          booking_details: bookingDetails,
          status: 'pending'
        }]);

      if (error) {
        console.warn('Supabase booking error:', error);
      }

      // Send email
      await sendConfirmationEmail('booking', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date: formData.date,
        service: `Mattress Disposal (${selectedType})`,
        orderNumber: generatedOrderNumber
      });

      setOrderNumber(generatedOrderNumber);
      setStep(4);
    } catch (err) {
      console.error('Error submitting booking:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-6 h-6 text-brand" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-secondary">Check Availability</h2>
        <p className="text-secondary-500">Enter your ZIP code to get started.</p>
      </div>

      <form onSubmit={handleZipSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value.replace(/\D/g, ''));
              setZipError(null);
            }}
            placeholder="e.g. 90210"
            className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest border-2 border-secondary-200 focus:border-brand rounded-2xl outline-none transition-colors"
            required
          />
        </div>
        {zipError && <p className="text-sm text-red-500 text-center font-medium">{zipError}</p>}
        <button
          type="submit"
          disabled={zipCode.length !== 5 || zipLoading}
          className="w-full py-4 bg-brand hover:bg-brand-600 text-white font-bold text-lg rounded-xl uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {zipLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Continue'}
        </button>
      </form>
    </div>
  );

  const renderStep2 = () => {
    const options: { type: MattressType; price: string; desc: string }[] = [
      { type: 'Mattress Only', price: '$75', desc: 'Any size mattress (Twin to CA King).' },
      { type: 'Mattress + Box Spring', price: '$125', desc: 'Mattress and matching box spring.' },
      { type: 'Full Set', price: '$175', desc: 'Mattress, box spring, and bed frame.' }
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <button onClick={() => setStep(1)} className="inline-flex items-center text-secondary-400 hover:text-brand text-sm font-bold uppercase tracking-wider mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <h2 className="text-2xl md:text-3xl font-black text-secondary">What are we picking up?</h2>
          <p className="text-secondary-500">Select the option that best fits your needs.</p>
        </div>

        <div className="grid gap-4">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleTypeSelect(opt.type)}
              className="flex items-center justify-between p-6 bg-white border-2 border-secondary-100 hover:border-brand rounded-2xl text-left transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center transition-colors">
                  <BedDouble className="w-6 h-6 text-secondary-400 group-hover:text-brand transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-lg group-hover:text-brand transition-colors">{opt.type}</h3>
                  <p className="text-sm text-secondary-500">{opt.desc}</p>
                </div>
              </div>
              <div className="font-black text-xl text-secondary">
                {opt.price}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <button onClick={() => setStep(2)} className="inline-flex items-center text-secondary-400 hover:text-brand text-sm font-bold uppercase tracking-wider mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-secondary">Reservation Details</h2>
        <p className="text-secondary-500">Final step! Tell us when and where.</p>
      </div>

      <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100 mb-6 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider">Selected Item</p>
          <p className="font-bold text-secondary">{selectedType}</p>
        </div>
        <button onClick={() => setStep(2)} className="text-brand text-sm font-bold hover:underline">Change</button>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Preferred Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 focus:border-brand rounded-xl outline-none font-medium text-secondary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 focus:border-brand rounded-xl outline-none font-medium text-secondary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-secondary-400" />
              </div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 focus:border-brand rounded-xl outline-none font-medium text-secondary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-secondary-400" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 focus:border-brand rounded-xl outline-none font-medium text-secondary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-2">Pickup Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St"
              className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 focus:border-brand rounded-xl outline-none font-medium text-secondary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className="w-full py-4 mt-6 bg-brand hover:bg-brand-600 text-white font-bold text-lg rounded-xl uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {submitLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in py-12">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-3xl font-black text-secondary">Booking Confirmed!</h2>
      <p className="text-secondary-500 leading-relaxed">
        Your mattress disposal is scheduled for <span className="font-bold text-secondary">{new Date(formData.date).toLocaleDateString()}</span>.<br/>
        We've sent a confirmation email with details.
      </p>
      
      {orderNumber && (
        <div className="inline-block p-4 bg-secondary-50 rounded-xl border border-secondary-100 font-mono font-bold text-lg text-secondary">
          {orderNumber}
        </div>
      )}

      <div className="pt-8">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-600 transition-colors uppercase tracking-wider text-sm"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50/30 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-12 max-w-md mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-secondary-200 -z-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand transition-all duration-500 ease-out"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    s === step ? 'bg-brand text-white ring-4 ring-brand/20' :
                    s < step ? 'bg-brand text-white' : 'bg-secondary-200 text-secondary-500'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-bold uppercase tracking-wider text-secondary-400">
              <span className={step >= 1 ? 'text-brand' : ''}>Zip</span>
              <span className={step >= 2 ? 'text-brand' : ''}>Type</span>
              <span className={step >= 3 ? 'text-brand' : ''}>Details</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-secondary-100">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderSuccess()}
        </div>
      </div>
      
      <div className="mt-20">
        <TrustBadges />
      </div>
    </div>
  );
};
