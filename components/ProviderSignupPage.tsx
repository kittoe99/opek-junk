import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Camera,
  X,
  ShieldCheck,
  MapPin,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  CalendarClock,
  Truck,
  Phone,
} from 'lucide-react';
import {
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PRIMARY_BUTTON,
  UTILITY_SECONDARY_BUTTON,
} from '../lib/flowPageLayout';
import { supabase } from '../lib/supabase';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { FlowProgressBar } from './shared/flow/FlowProgressBar';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';

const HERO_CTA = UTILITY_PRIMARY_BUTTON.replace('w-full ', '');

const SIGNUP_STEPS = ['About you', 'Service areas', 'Vehicle & docs', 'Availability'] as const;

const PROVIDER_HERO_FEATURES = [
  {
    icon: MapPin,
    iconColor: 'text-brand',
    title: 'Local demand',
    description: 'Jobs routed to the metros you choose to serve.',
  },
  {
    icon: CalendarClock,
    iconColor: 'text-brand',
    title: 'Your hours',
    description: 'Pick part-time volume or fill your route.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-brand',
    title: 'Vetted network',
    description: 'Onboard with clear standards and dispatch support.',
  },
] as const;

const usStates = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

const metroAreasByState: Record<string, string[]> = {
  AL: ['Birmingham Metro', 'Huntsville / North AL', 'Montgomery Area', 'Mobile / Gulf Coast'],
  AK: ['Anchorage Metro', 'Fairbanks Area', 'Juneau / Southeast'],
  AZ: ['Phoenix Metro', 'Tucson / Southern AZ', 'Flagstaff / Northern AZ'],
  AR: ['Little Rock Metro', 'Fayetteville / NWA', 'Fort Smith Area'],
  CA: ['Los Angeles / Orange County', 'San Francisco Bay Area', 'San Diego Metro', 'Sacramento Metro', 'Inland Empire', 'Central Valley (Fresno/Bakersfield)', 'Central Coast'],
  CO: ['Denver Metro / Front Range', 'Colorado Springs', 'Boulder / Northern CO'],
  CT: ['Hartford / Central CT', 'Fairfield County', 'New Haven Area'],
  DE: ['Wilmington / Northern DE', 'Dover / Sussex County'],
  FL: ['Miami / South Florida', 'Tampa Bay Area', 'Orlando / Central FL', 'Jacksonville / NE FL', 'SW Florida (Ft. Myers/Naples)'],
  GA: ['Atlanta Metro', 'Augusta / CSRA', 'Savannah / Coastal GA', 'Columbus / West GA'],
  HI: ['Honolulu / Oahu', 'Maui County', 'Hawaii Island'],
  ID: ['Boise Metro', 'Coeur d\'Alene / North ID', 'Idaho Falls / East ID'],
  IL: ['Chicago Metro', 'Rockford / Northern IL', 'Peoria / Central IL', 'Springfield Area'],
  IN: ['Indianapolis Metro', 'Fort Wayne / NE Indiana', 'Evansville / Southern IN', 'South Bend / Michiana'],
  IA: ['Des Moines Metro', 'Cedar Rapids / Eastern IA', 'Quad Cities Area', 'Iowa City / Corridor'],
  KS: ['Kansas City Metro', 'Wichita / South Central KS', 'Topeka / NE Kansas'],
  KY: ['Louisville Metro', 'Lexington / Central KY', 'Bowling Green / South KY'],
  LA: ['New Orleans / SE Louisiana', 'Baton Rouge Area', 'Shreveport / NW LA', 'Lafayette / Acadiana'],
  ME: ['Portland / Southern ME', 'Bangor / Central ME', 'Lewiston-Auburn Area'],
  MD: ['Baltimore Metro', 'DC / Maryland Suburbs', 'Frederick / Western MD'],
  MA: ['Boston Metro', 'Springfield / Western MA', 'Worcester / Central MA'],
  MI: ['Detroit Metro', 'Grand Rapids / West MI', 'Ann Arbor Area', 'Lansing / Mid-Michigan'],
  MN: ['Minneapolis-St. Paul Metro', 'Rochester / Southern MN', 'Duluth / Northern MN'],
  MS: ['Jackson Metro', 'Gulf Coast (Biloxi/Gulfport)'],
  MO: ['St. Louis Metro', 'Kansas City Metro', 'Springfield / SW MO', 'Columbia / Central MO'],
  MT: ['Billings / Eastern MT', 'Missoula / Western MT', 'Bozeman / SW MT'],
  NE: ['Omaha Metro', 'Lincoln Area', 'Grand Island / Central NE'],
  NV: ['Las Vegas Metro', 'Reno / Northern NV'],
  NH: ['Manchester-Nashua Area', 'Concord / Central NH', 'Seacoast Region'],
  NJ: ['Newark / North Jersey', 'Trenton / Central NJ', 'Atlantic City / South Jersey', 'Jersey Shore'],
  NM: ['Albuquerque Metro', 'Santa Fe Area', 'Las Cruces / Southern NM'],
  NY: ['New York City Metro', 'Buffalo / Western NY', 'Rochester Area', 'Albany / Capital Region', 'Syracuse / Central NY'],
  NC: ['Charlotte Metro', 'Raleigh-Durham / Triangle', 'Greensboro-Winston-Salem / Triad', 'Asheville / Western NC'],
  ND: ['Fargo Metro', 'Bismarck Area', 'Grand Forks / Red River'],
  OH: ['Cleveland / NE Ohio', 'Columbus Metro', 'Cincinnati / SW Ohio', 'Toledo / NW Ohio', 'Akron-Canton Area'],
  OK: ['Oklahoma City Metro', 'Tulsa / Eastern OK'],
  OR: ['Portland Metro', 'Salem / Willamette Valley', 'Eugene / Southern Valley', 'Bend / Central OR'],
  PA: ['Philadelphia Metro', 'Pittsburgh / Western PA', 'Harrisburg / Central PA', 'Lehigh Valley (Allentown)', 'Erie / NW PA'],
  RI: ['Providence Metro', 'Newport / South County'],
  SC: ['Greenville-Spartanburg / Upstate', 'Columbia Metro', 'Charleston / Lowcountry', 'Myrtle Beach / Grand Strand'],
  SD: ['Sioux Falls Metro', 'Rapid City / Black Hills'],
  TN: ['Nashville / Middle TN', 'Memphis / West TN', 'Knoxville / East TN', 'Chattanooga Area'],
  TX: ['Dallas-Fort Worth Metro', 'Houston Metro', 'Austin Metro', 'San Antonio Metro', 'El Paso / West Texas', 'Rio Grande Valley'],
  UT: ['Salt Lake City / Wasatch Front', 'Provo / Utah Valley', 'St. George / Southern UT', 'Ogden / Northern UT'],
  VT: ['Burlington / NW Vermont', 'Rutland / Southern VT'],
  VA: ['Northern VA / DC Suburbs', 'Richmond Metro', 'Virginia Beach / Hampton Roads', 'Roanoke / SW VA'],
  WA: ['Seattle-Tacoma Metro', 'Spokane / Eastern WA', 'Vancouver / SW WA'],
  WV: ['Charleston / Southern WV', 'Morgantown / North Central'],
  WI: ['Milwaukee Metro', 'Madison / South Central WI', 'Green Bay / NE Wisconsin'],
  WY: ['Cheyenne / SE Wyoming', 'Casper / Central WY'],
};

interface ServiceAreaEntry {
  state: string;
  metroArea: string;
}

const vehicleTypes = [
  'Pickup Truck',
  'Box Truck (14-16 ft)',
  'Box Truck (18-20 ft)',
  'Box Truck (22-26 ft)',
  'Dump Truck',
  'Trailer',
  'Multiple Vehicles',
];

export const ProviderSignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceAreas: [] as ServiceAreaEntry[],
    vehicleType: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    availability: '' as '' | 'few_jobs' | 'many_jobs',
    additionalInfo: ''
  });
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [insuranceImages, setInsuranceImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, { state: '', metroArea: '' }]
    }));
  };

  const removeServiceArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
  };

  const updateServiceArea = (index: number, field: 'state' | 'metroArea', value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) =>
        i === index ? { ...area, [field]: value, ...(field === 'state' ? { metroArea: '' } : {}) } : area
      )
    }));
  };

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
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: 'vehicle' | 'insurance'
  ) => {
    const files = event.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const compressedList = await Promise.all(Array.from(files).map((file) => compressImage(file)));
      if (target === 'vehicle') {
        setVehicleImages(prev => [...prev, ...compressedList]);
      } else {
        setInsuranceImages(prev => [...prev, ...compressedList]);
      }
    } catch (err) {
      console.error('Error compressing images:', err);
    } finally {
      setUploading(false);
    }
    event.target.value = '';
  };

  const removeImage = (index: number, target: 'vehicle' | 'insurance') => {
    if (target === 'vehicle') {
      setVehicleImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setInsuranceImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 2 && formData.serviceAreas.length === 0) {
      setError('Please add at least one service area.');
      return;
    }
    if (step === 3) {
      if (!formData.vehicleType) { setError('Please select your vehicle type.'); return; }
      if (!formData.vehicleYear) { setError('Please enter your vehicle year.'); return; }
      if (!formData.vehicleMake) { setError('Please enter your vehicle make.'); return; }
      if (!formData.vehicleModel) { setError('Please enter your vehicle model.'); return; }
      if (vehicleImages.length === 0) { setError('Please upload at least one vehicle photo.'); return; }
      if (insuranceImages.length === 0) { setError('Please upload your insurance document.'); return; }
    }

    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadToStorage = async (images: string[], prefix: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const mimeType = img.split(';')[0].split(':')[1];
      const ext = mimeType === 'image/png' ? 'png' : 'jpg';
      const fileName = `${prefix}_${Date.now()}_${i}.${ext}`;
      const res = await fetch(img);
      const blob = await res.blob();
      const { data, error } = await supabase.storage
        .from('provider-docs')
        .upload(fileName, blob, {
          contentType: mimeType,
          upsert: false,
        });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('provider-docs').getPublicUrl(fileName);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.availability) {
      setError('Please select your availability preference.');
      return;
    }
    if (!formData.additionalInfo.trim()) {
      setError('Please provide additional details about your experience.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const providerName = `${formData.firstName} ${formData.lastName}`;

      const vehicleImageUrls = await uploadToStorage(vehicleImages, `${providerName.replace(/\s+/g, '_')}_vehicle`);
      const insuranceDocUrls = await uploadToStorage(insuranceImages, `${providerName.replace(/\s+/g, '_')}_insurance`);

      const { error: insertError } = await supabase
        .from('provider_signups')
        .insert([{
          customer_info: {
            name: providerName,
            email: formData.email,
            phone: formData.phone
          },
          provider_info: {
            business_name: formData.businessName,
            service_areas: formData.serviceAreas,
            vehicle: {
              type: formData.vehicleType,
              year: formData.vehicleYear,
              make: formData.vehicleMake,
              model: formData.vehicleModel,
              images: vehicleImageUrls,
              insurance: insuranceDocUrls,
            },
            availability: formData.availability,
            additional_info: formData.additionalInfo,
          },
          status: 'pending'
        }]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting provider signup:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  const selectCls = `${UTILITY_INPUT} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat`;

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (submitted) {
    const providerName = `${formData.firstName} ${formData.lastName}`.trim();

    return (
      <SubmissionSuccessView
        title="Application submitted"
        description="We received your provider application and will review it shortly."
        summary={[
          { label: 'Name', value: providerName },
          { label: 'Email', value: formData.email },
          { label: 'Phone', value: formData.phone },
          { label: 'Business', value: formData.businessName },
          { label: 'Service areas', value: formData.serviceAreas.map(a => `${a.metroArea}, ${a.state}`).join('; ') },
          { label: 'Vehicle', value: formData.vehicleType },
          { label: 'Vehicle details', value: `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`.trim() },
          { label: 'Availability', value: formData.availability === 'few_jobs' ? 'A few jobs a week' : 'As many as possible' },
          { label: 'Notes', value: formData.additionalInfo },
        ]}
      />
    );
  }

  return (
    <div className="home-dark min-h-screen bg-[var(--bg)]">
      <section className="relative bg-[var(--surface)] overflow-hidden border-b border-[var(--border)]">
        <div className="lg:hidden">
          <div className="px-5 pt-2.5 pb-8 text-center max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">Provider network</p>

            <h1 className="font-sans text-[2rem] sm:text-[2.25rem] font-semibold text-[var(--text)] tracking-tight leading-[1.12] mb-4">
              Hauling work,
              <br />
              on your terms.
            </h1>

            <p className="text-[15px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-6 max-w-[20rem] mx-auto">
              Apply to join independent contractors receiving junk removal jobs through Opek&apos;s dispatch network.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full mb-2">
              <button
                type="button"
                onClick={scrollToForm}
                className={`shrink-0 px-6 py-3 text-[15px] font-semibold !rounded-full whitespace-nowrap ${HERO_CTA}`}
              >
                Start application
              </button>
              <a
                href="tel:8313187139"
                className="shrink-0 py-3 text-sm font-medium text-[var(--text)] hover:text-brand transition-colors whitespace-nowrap inline-flex items-center gap-1"
              >
                <Phone size={14} />
                Questions? Call us
              </a>
            </div>

            <div className="mt-7 rounded-2xl overflow-hidden bg-white/[0.04] aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center p-6">
              <img
                src="/opek-junk-haul-away.png?v=1"
                alt="Independent hauling contractor on a job"
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </div>

            <div className="border-t border-[var(--border)] pt-8 mt-2 space-y-8">
              {PROVIDER_HERO_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center px-2">
                    <Icon size={36} className={`mx-auto mb-3 ${feature.iconColor}`} strokeWidth={1.5} />
                    <h2 className="text-base font-bold text-[var(--text)] mb-1.5">{feature.title}</h2>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[18rem] mx-auto">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="max-w-[72rem] mx-auto px-8 xl:px-10 pt-8 xl:pt-10 pb-0">
            <div className="grid grid-cols-2 gap-12 xl:gap-14 items-center">
              <div className="max-w-[28rem]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">Provider network</p>
                <h1 className="font-sans text-[2.625rem] xl:text-[3.125rem] font-semibold text-[var(--text)] tracking-tight mb-4 leading-[1.1]">
                  Hauling work,
                  <br />
                  on your terms.
                </h1>
                <p className="text-lg text-[#6b7c78] mb-7 leading-relaxed">
                  Apply to join vetted contractors receiving local junk removal jobs, dispatch tools, and weekly payouts.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className={`!rounded-full px-7 py-3 text-[15px] font-semibold inline-flex items-center gap-2 ${HERO_CTA}`}
                  >
                    Start application
                    <ArrowRight size={16} />
                  </button>
                  <a
                    href="tel:8313187139"
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[var(--text)] hover:text-brand transition-colors"
                  >
                    <Phone size={15} />
                    (831) 318-7139
                  </a>
                </div>
              </div>

              <div>
                <div className="aspect-[5/4] w-full overflow-hidden rounded-[1.5rem] bg-white/[0.04] flex items-center justify-center p-8 xl:p-10">
                  <img
                    src="/opek-junk-haul-away.png?v=1"
                    alt="Independent hauling contractor on a job"
                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-10 xl:gap-14 mt-12 xl:mt-14 pt-10 xl:pt-12 border-t border-[var(--border)] pb-10 xl:pb-12">
              {PROVIDER_HERO_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center">
                    <Icon size={32} className={`mx-auto mb-3 ${feature.iconColor}`} strokeWidth={1.5} />
                    <h2 className="text-[15px] font-bold text-[var(--text)] mb-1">{feature.title}</h2>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[15rem] mx-auto">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div
        ref={formSectionRef}
        className="scroll-mt-[var(--site-header-height)] bg-[var(--bg)] border-t border-[var(--border)]"
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              Step {step} of {SIGNUP_STEPS.length}
              <span className="text-neutral-500 font-normal"> · {SIGNUP_STEPS[step - 1]}</span>
            </p>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Truck size={13} className="text-brand" />
              Provider application
            </div>
          </div>
          <FlowProgressBar progress={step / SIGNUP_STEPS.length} />

          <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 md:p-10 shadow-[0_2px_12px_rgba(53,80,112,0.06)] mt-4 animate-fade-in">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
              <FlowStepTitle
                title="About you"
                subtitle="Start with your contact and business details."
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={UTILITY_LABEL}>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className={UTILITY_INPUT} />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith" className={UTILITY_INPUT} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={UTILITY_LABEL}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className={UTILITY_INPUT} />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139" className={UTILITY_INPUT} />
                  </div>
                </div>
                <div>
                  <label className={UTILITY_LABEL}>Business Name *</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required placeholder="e.g. John's Hauling LLC" className={UTILITY_INPUT} />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={UTILITY_PRIMARY_BUTTON}
                >
                  Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
              <FlowStepTitle
                title="Service areas"
                subtitle="Select the metropolitan areas where you provide service."
              />

              <div className="space-y-4">
                {formData.serviceAreas.map((area, index) => (
                  <div key={index} className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-3 relative shadow-[0_2px_8px_rgba(53,80,112,0.06)]">
                    <button
                      type="button"
                      onClick={() => removeServiceArea(index)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/[0.04] hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className={UTILITY_LABEL}>State *</label>
                        <select
                          value={area.state}
                          onChange={(e) => updateServiceArea(index, 'state', e.target.value)}
                          required
                          className={selectCls}
                        >
                          <option value="">Select state</option>
                          {usStates.map(s => (
                            <option key={s.code} value={s.code}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={UTILITY_LABEL}>Metro Area *</label>
                        <select
                          value={area.metroArea}
                          onChange={(e) => updateServiceArea(index, 'metroArea', e.target.value)}
                          required
                          disabled={!area.state}
                          className={selectCls}
                        >
                          <option value="">{area.state ? 'Select metro area' : 'Choose state first'}</option>
                          {(metroAreasByState[area.state] || []).map(metro => (
                            <option key={metro} value={metro}>{metro}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addServiceArea}
                  className="w-full py-3 border-2 border-dashed border-secondary-200 hover:border-brand/40 rounded-xl text-[var(--text-muted)] hover:text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={14} /> Add Service Area
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`${UTILITY_SECONDARY_BUTTON} flex-1 !w-auto px-6`}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={formData.serviceAreas.length === 0}
                  className={`${UTILITY_PRIMARY_BUTTON} flex-1`}
                >
                  Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
              <FlowStepTitle
                title="Vehicle & documents"
                subtitle="Tell us about your equipment and upload supporting documents."
              />

              <div className="space-y-4">
                <div>
                  <label className={UTILITY_LABEL}>Vehicle Type *</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required className={selectCls}>
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={UTILITY_LABEL}>Year *</label>
                    <input type="text" name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} required maxLength={4} placeholder="2024" className={UTILITY_INPUT} />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>Make *</label>
                    <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} required placeholder="Ford" className={UTILITY_INPUT} />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>Model *</label>
                    <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} required placeholder="F-150" className={UTILITY_INPUT} />
                  </div>
                </div>

                <div>
                  <label className={UTILITY_LABEL}>Vehicle Photos *</label>
                  <input type="file" ref={vehicleInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'vehicle')} />

                  {vehicleImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      {vehicleImages.map((img, i) => (
                        <div key={i} className="relative aspect-[4/3] border border-[var(--border)] bg-[var(--surface)] overflow-hidden rounded-xl">
                          <img src={img} alt={`Vehicle ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i, 'vehicle')}
                            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center transition-colors rounded-full shadow"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => vehicleInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-3 border-2 border-dashed border-secondary-200 hover:border-brand/40 rounded-xl text-[var(--text-muted)] hover:text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    {vehicleImages.length > 0 ? 'Add More Vehicle Photos' : 'Upload Vehicle Photos'}
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={14} className="text-brand" strokeWidth={2.5} />
                    <label className={UTILITY_LABEL}>Insurance / COI *</label>
                  </div>
                  <input type="file" ref={insuranceInputRef} className="hidden" accept="image/*,.pdf" multiple onChange={(e) => handleImageUpload(e, 'insurance')} />

                  {insuranceImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      {insuranceImages.map((img, i) => (
                        <div key={i} className="relative aspect-[4/3] border border-[var(--border)] bg-[var(--surface)] overflow-hidden rounded-xl">
                          <img src={img} alt={`Insurance doc ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i, 'insurance')}
                            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center transition-colors rounded-full shadow"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => insuranceInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-3 border-2 border-dashed border-secondary-200 hover:border-brand/40 rounded-xl text-[var(--text-muted)] hover:text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {insuranceImages.length > 0 ? 'Add More Documents' : 'Upload Insurance / COI'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`${UTILITY_SECONDARY_BUTTON} flex-1 !w-auto px-6`}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={!formData.vehicleType}
                  className={`${UTILITY_PRIMARY_BUTTON} flex-1`}
                >
                  Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <FlowStepTitle
                title="Availability"
                subtitle="How many jobs are you looking to take on?"
              />

              <div className="space-y-4">
                <div>
                  <label className={`${UTILITY_LABEL} mb-3`}>Preferred Volume *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'few_jobs' as const, label: 'A Few Jobs a Week', desc: 'Supplemental income, part-time flexibility' },
                      { value: 'many_jobs' as const, label: 'As Many as Possible', desc: 'Full-time volume, maximize earnings' },
                    ].map(option => {
                      const isSelected = formData.availability === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, availability: option.value }))}
                          className={`group p-4 border rounded-xl flex flex-col gap-1.5 transition-all duration-200 w-full text-left bg-[var(--surface)] ${
                            isSelected
                              ? 'border-brand shadow-md shadow-brand/5 scale-[1.01]'
                              : 'border-[var(--border)] hover:border-brand/40 hover:shadow-md hover:shadow-brand/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'border-brand bg-brand' : 'border-secondary-200'
                            }`}>
                              {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-brand' : 'text-[var(--text)] group-hover:text-brand'}`}>
                              {option.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)] pl-6">{option.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={UTILITY_LABEL}>Additional Details *</label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Share details about your experience, equipment, license status, or team size..."
                    className={`${UTILITY_INPUT} resize-none`}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`${UTILITY_SECONDARY_BUTTON} flex-1 !w-auto px-6`}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.availability}
                  className={`${UTILITY_PRIMARY_BUTTON} flex-1`}
                >
                  {submitting ? 'Submitting...' : <><Check size={14} strokeWidth={3} /> Submit Application</>}
                </button>
              </div>
              <p className="text-[10px] text-neutral-500 text-center">By submitting, you agree to the contractor terms and network guidelines.</p>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};