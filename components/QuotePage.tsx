import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { detectItemsFromPhoto, getPriceForItems } from '../services/openaiService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'ai' | 'manual' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // AI State
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [aiStep, setAiStep] = useState<'upload' | 'items' | 'result'>('upload');
  const [newItemName, setNewItemName] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Manual Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', zipCode: '', date: '', details: ''
  });
  const [zipError, setZipError] = useState<string>('');

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1920;
          if (width > height) {
            if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
          } else {
            if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        setEstimate(null);
        setDetectedItems([]);
        setLoadingState(LoadingState.IDLE);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoadingState(LoadingState.ANALYZING);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const items = await detectItemsFromPhoto(base64Data, mimeType);
      setDetectedItems(items);
      setAiStep('items');
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleGetPrice = async () => {
    if (detectedItems.length === 0) return;
    setPricingLoading(true);
    try {
      const price = await getPriceForItems(detectedItems);
      setPriceEstimate(price);
      setEstimate({
        itemsDetected: detectedItems.map(i => `${i.quantity}x ${i.name}`),
        estimatedVolume: price.estimatedVolume,
        priceRange: price.priceRange,
        summary: price.summary,
      });
      setAiStep('result');
    } catch (error) {
      console.error('Pricing error:', error);
    } finally {
      setPricingLoading(false);
    }
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setDetectedItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setDetectedItems(prev => prev.filter(item => item.id !== id));
  };

  const addManualItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setDetectedItems(prev => [...prev, { id: `manual-${Date.now()}`, name, quantity: 1 }]);
    setNewItemName('');
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('schedule_visits')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          zip_code: formData.zipCode,
          preferred_date: formData.date,
          details: formData.details,
          status: 'pending'
        }]);
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting schedule visit:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
      setSubmitting(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'zipCode') {
      if (value && !/^80\d{3}$/.test(value)) {
        setZipError('Please enter a valid Denver area zip code (80xxx)');
      } else {
        setZipError('');
      }
    }
  };

  // --- Submitted screen ---
  if (submitted) {
    return (
      <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
        <Breadcrumb items={[{ label: 'Get a Quote' }]} />
        <section className="py-16 md:py-20 lg:py-32">
          <div className="flex items-center justify-center">
            <div className="max-w-lg mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-full">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-4xl font-black mb-4">Request Received</h2>
              <p className="text-gray-600 mb-8">
                You'll be contacted by matched service providers within 15 minutes to confirm your {selectedOption === 'ai' ? 'estimate' : 'appointment'}.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded-lg"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- Selection screen ---
  if (!selectedOption) {
    return (
      <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
        <Breadcrumb items={[{ label: 'Get a Quote' }]} />
        <section className="py-16 md:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-3">Get a Quote</h1>
              <p className="text-gray-600">Choose your method</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              <button
                onClick={() => setSelectedOption('ai')}
                className="group p-6 border border-gray-200 hover:border-black transition-all text-left bg-white shadow-sm hover:shadow-lg rounded-lg"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                  <Camera size={28} />
                </div>
                <h3 className="text-xl font-black mb-2">AI Photo Estimate</h3>
                <p className="text-gray-600 text-sm mb-4">Instant pricing from a photo</p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                  Continue
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedOption('manual')}
                className="group p-6 border border-gray-200 hover:border-black transition-all text-left bg-white shadow-sm hover:shadow-lg rounded-lg"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-xl font-black mb-2">Schedule Visit</h3>
                <p className="text-gray-600 text-sm mb-4">In-person quote for accuracy</p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                  Continue
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl max-w-3xl mx-auto">
              <img src="/opek2.webp" loading="lazy" alt="Professional junk removal service" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                <p className="text-white text-sm md:text-base font-bold text-center">Fast, reliable service with transparent pricing</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- Main flow ---
  return (
    <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
      <Breadcrumb items={[{ label: 'Get a Quote' }]} />
      <section className="py-16 md:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedOption(null)}
            className="mb-8 text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            ← Back to options
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {selectedOption === 'ai' ? 'AI Photo Estimate' : 'Schedule Visit'}
            </h1>
          </div>

          {/* ===== AI CONTENT ===== */}
          {selectedOption === 'ai' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-10">
                {['Upload', 'Review Items', 'Estimate'].map((label, i) => {
                  const isComplete = (i === 0 && aiStep !== 'upload') || (i === 1 && aiStep === 'result');
                  const isActive = (i === 0 && aiStep === 'upload') || (i === 1 && aiStep === 'items') || (i === 2 && aiStep === 'result');
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          isComplete || isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isComplete ? <CheckCircle size={18} /> : i + 1}
                        </div>
                        <span className="text-[10px] font-bold mt-1.5 uppercase tracking-wider text-gray-500">{label}</span>
                      </div>
                      {i < 2 && <div className={`w-12 h-0.5 mx-2 mb-5 ${isComplete ? 'bg-black' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step 1: Upload */}
              {aiStep === 'upload' && (
                <>
                  {!image ? (
                    <div className="space-y-4">
                      <div
                        className="border border-dashed border-gray-300 p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Take Photo</h3>
                        <p className="text-gray-600">Use your camera to capture the junk</p>
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                      <div
                        className="border border-dashed border-gray-300 p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload Photo</h3>
                        <p className="text-gray-600">Choose a photo from your device</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                        <img src={image} alt="Upload" className="w-full" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button
                            onClick={() => { setImage(null); setEstimate(null); setDetectedItems([]); }}
                            className="absolute top-4 right-4 bg-white text-black px-4 py-2 text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors rounded-lg"
                          >
                            Change Photo
                          </button>
                        )}
                      </div>
                      {loadingState === LoadingState.IDLE && (
                        <button
                          onClick={handleAnalyze}
                          className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          Analyze Photo
                        </button>
                      )}
                      {loadingState === LoadingState.ANALYZING && (
                        <div className="py-12 text-center">
                          <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                          <p className="text-gray-600">Identifying items in your photo...</p>
                        </div>
                      )}
                      {loadingState === LoadingState.ERROR && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                          <p className="text-red-700 text-sm font-bold mb-2">Failed to analyze photo</p>
                          <button onClick={handleAnalyze} className="text-sm font-bold text-black underline">Try again</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Review & Edit Items */}
              {aiStep === 'items' && (
                <div className="space-y-6">
                  {image && (
                    <div className="flex gap-4 items-start">
                      <img src={image} alt="Your photo" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                      <div>
                        <p className="text-sm font-bold text-black">{detectedItems.length} items detected</p>
                        <p className="text-xs text-gray-500 mt-1">Review, edit quantities, remove items, or add anything we missed.</p>
                      </div>
                    </div>
                  )}
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-medium text-gray-800 flex-1 mr-3">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateItemQuantity(item.id, -1)} className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Minus size={14} className="text-gray-500" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.id, 1)} className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Plus size={14} className="text-gray-500" />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors ml-1">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                      placeholder="Add an item (e.g. Old Desk)"
                      className="flex-1 border border-gray-200 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      onClick={addManualItem}
                      disabled={!newItemName.trim()}
                      className="px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setAiStep('upload'); setLoadingState(LoadingState.IDLE); }}
                      className="flex-1 py-3.5 border border-black text-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGetPrice}
                      disabled={detectedItems.length === 0}
                      className="flex-1 py-3.5 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Get Estimate
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing loading */}
              {pricingLoading && (
                <div className="py-16 text-center">
                  <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Calculating your estimate...</p>
                </div>
              )}

              {/* Step 3: Price Result */}
              {aiStep === 'result' && priceEstimate && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 md:p-8 border border-gray-200 rounded-lg">
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items ({detectedItems.reduce((sum, i) => sum + i.quantity, 0)})</div>
                      <div className="flex flex-wrap gap-2">
                        {detectedItems.map((item) => (
                          <span key={item.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                            {item.quantity > 1 && <span className="font-bold">{item.quantity}x</span>}
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estimated Volume</div>
                      <div className="text-2xl font-black">{priceEstimate.estimatedVolume}</div>
                    </div>
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range</div>
                      <div className="text-4xl font-black">${priceEstimate.priceRange.min} &ndash; ${priceEstimate.priceRange.max}</div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-200">{priceEstimate.summary}</p>
                    <button
                      onClick={() => navigate('/booking', { state: { estimate, image } })}
                      className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Confirm Booking
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">* Final price confirmed on-site</p>
                  </div>
                  <button
                    onClick={() => { setAiStep('items'); setPriceEstimate(null); }}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    ← Edit items and re-estimate
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== MANUAL CONTENT ===== */}
          {selectedOption === 'manual' && (
            <div>
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-12">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep >= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                        currentStep >= step ? 'text-black' : 'text-gray-400'
                      }`}>
                        {step === 1 ? 'Zip Code' : step === 2 ? 'Contact' : step === 3 ? 'Details' : 'Review'}
                      </span>
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-0.5 mx-2 mb-6 transition-colors ${
                        currentStep > step ? 'bg-black' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Zip Code */}
              {currentStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black mb-3">Check Service Availability</h3>
                    <p className="text-gray-600">Enter your zip code to verify we service your area</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Zip Code</label>
                    <input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      pattern="80\d{3}"
                      placeholder="80xxx"
                      maxLength={5}
                      className={`w-full border px-4 py-4 text-lg focus:outline-none transition-colors rounded-lg shadow-sm ${
                        zipError ? 'border-red-500' : 'border-gray-200 focus:border-black'
                      }`}
                    />
                    {zipError && <p className="text-red-500 text-sm mt-2 font-medium">{zipError}</p>}
                    <p className="text-gray-500 text-sm mt-2">We serve Denver area zip codes (80xxx within 50-mile radius)</p>
                  </div>
                  <button
                    type="submit"
                    disabled={!!zipError || !formData.zipCode}
                    className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Verify & Continue
                  </button>
                </form>
              )}

              {/* Step 2: Contact Info */}
              {currentStep === 2 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md">
                    Next Step
                  </button>
                </form>
              )}

              {/* Step 3: Service Details */}
              {currentStep === 3 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Address</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Preferred Date</label>
                    <input name="date" type="date" value={formData.date} onChange={handleInputChange} required className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Details</label>
                    <textarea name="details" rows={4} value={formData.details} onChange={handleInputChange} placeholder="Describe what needs to be removed" className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={handlePrevStep} className="flex-1 py-4 border border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg shadow-sm">
                      Back
                    </button>
                    <button type="submit" className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md">
                      Next Step
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm">
                    <h3 className="text-xl font-black mb-4">Review Your Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</div>
                        <div className="font-bold">{formData.name}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                        <div className="font-bold">{formData.email}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                        <div className="font-bold">{formData.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</div>
                        <div className="font-bold">{formData.date}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</div>
                      <div className="font-bold">{formData.address}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Zip Code</div>
                      <div className="font-bold">{formData.zipCode}</div>
                    </div>
                    {formData.details && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Details</div>
                        <div className="text-gray-700">{formData.details}</div>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                      <p className="text-red-700 text-sm font-bold">{error}</p>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button type="button" onClick={handlePrevStep} disabled={submitting} className="flex-1 py-4 border border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      Back
                    </button>
                    <button type="button" onClick={handleManualSubmit} disabled={submitting} className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                      {submitting ? 'Submitting...' : 'Confirm & Submit'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
