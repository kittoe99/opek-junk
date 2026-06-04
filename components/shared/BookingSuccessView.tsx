import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Phone, ArrowRight, Calendar, Sparkles, Navigation } from 'lucide-react';

interface BookingSuccessViewProps {
  orderNumber: string | null;
  serviceType: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  unitNumber?: string | null;
  city: string;
  state: string;
  zipCode: string;
  date: string;
  details?: string;
  price?: number | null;
  itemsDetected?: string[];
  estimatedVolume?: string;
}

export const BookingSuccessView: React.FC<BookingSuccessViewProps> = ({
  orderNumber,
  serviceType,
  name,
  phone,
  email,
  address,
  unitNumber,
  city,
  state,
  zipCode,
  date,
  details,
  price,
  itemsDetected,
  estimatedVolume
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const formattedDate = React.useMemo(() => {
    if (!date) return 'TBD';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  }, [date]);

  const googleMapsUrl = React.useMemo(() => {
    const query = encodeURIComponent(`${address}${unitNumber ? ', ' + unitNumber : ''}, ${city}, ${state} ${zipCode}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [address, unitNumber, city, state, zipCode]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl shadow-secondary/10 border border-secondary-100 overflow-hidden animate-fade-in">
      
      {/* 1. Header Card (Dark Premium Theme) */}
      <div className="bg-secondary p-8 text-white relative overflow-hidden">
        {/* Subtle background abstract shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Thank You</h2>
            <p className="text-secondary-300 text-sm">
              Your booking has been received. You will receive an email confirmation shortly.
            </p>
          </div>

          {/* Progress Tracker Info */}
          <div className="flex items-center gap-2.5 pt-2">
            <div className="w-6 h-6 bg-brand/20 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles size={12} className="text-brand" />
            </div>
            <div className="text-xs font-semibold text-secondary-200">
              Quick Match: <span className="text-brand font-black">Matching</span> &middot; Order #{orderNumber || 'OPK-BOOKING'}
            </div>
          </div>

          {/* Horizontal Progress Timeline */}
          <div className="pt-4 pb-2">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-2.5 left-[15px] right-[15px] h-0.5 bg-secondary-700 -translate-y-1/2">
                <div className="h-full w-1/2 bg-brand" />
              </div>

              {/* Steps */}
              <div className="flex justify-between items-center relative">
                {/* Step 1: Received */}
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white ring-4 ring-brand/20">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand mt-2">Received</span>
                </div>

                {/* Step 2: Matching */}
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-secondary border-2 border-brand flex items-center justify-center ring-4 ring-brand/10 animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white mt-2">Matching</span>
                </div>

                {/* Step 3: Scheduled */}
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-secondary-700 border-2 border-secondary-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-secondary-400 mt-2">Scheduled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current status note */}
          <p className="text-xs text-brand bg-brand/10 border border-brand/20 px-3.5 py-2 rounded-xl inline-block font-semibold">
            A vetted service provider is now being matched to your job in {city}.
          </p>
        </div>
      </div>

      {/* 2. Details and Action Buttons (Light Theme) */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Service Address Card */}
        <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-5 space-y-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-secondary-100 flex items-center justify-center text-brand shrink-0">
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-0.5">Service Location</p>
              <p className="text-sm font-bold text-secondary truncate">
                {address}{unitNumber ? `, ${unitNumber}` : ''}
              </p>
              <p className="text-xs text-secondary-400">
                {[city, state, zipCode].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 border border-secondary-200 text-secondary hover:border-brand hover:text-brand font-bold text-xs uppercase tracking-wider rounded-xl transition-colors bg-white shadow-sm"
            >
              <Navigation size={13} /> Directions
            </a>
            <a
              href="tel:8313187139"
              className="flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-brand/10"
            >
              <Phone size={13} /> Call
            </a>
          </div>
        </div>

        {/* Booking Details / Items Card */}
        <div className="border border-secondary-100 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-2">Booking Summary</p>
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-secondary-50">
                  <td className="py-2.5 text-secondary-400 font-medium">Service Type</td>
                  <td className="py-2.5 text-secondary font-bold text-right">{serviceType}</td>
                </tr>
                <tr className="border-b border-secondary-50">
                  <td className="py-2.5 text-secondary-400 font-medium">Scheduled Date</td>
                  <td className="py-2.5 text-secondary font-bold text-right">{formattedDate}</td>
                </tr>
                {estimatedVolume && (
                  <tr className="border-b border-secondary-50">
                    <td className="py-2.5 text-secondary-400 font-medium">Volume Description</td>
                    <td className="py-2.5 text-secondary font-bold text-right">{estimatedVolume}</td>
                  </tr>
                )}
                {price ? (
                  <tr className="border-b border-secondary-50">
                    <td className="py-2.5 text-secondary-400 font-medium">Estimated Price</td>
                    <td className="py-2.5 text-brand font-black text-sm text-right">${price}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Itemized list of items */}
          {itemsDetected && itemsDetected.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider">
                {itemsDetected.length} Detected Item{itemsDetected.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {itemsDetected.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-secondary-50 border border-secondary-100 text-secondary-600 rounded-md text-[11px] font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {details && (
            <div className="pt-2 border-t border-secondary-50">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-1">Service Notes</p>
              <p className="text-xs text-secondary-500 italic bg-secondary-50/50 p-3 rounded-lg border-l-2 border-brand/50 white-space-pre-line">
                {details}
              </p>
            </div>
          )}
        </div>

        {/* Redirect Notice countdown bar */}
        <div className="pt-4 border-t border-secondary-100 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-secondary-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            Redirecting to home page in <span className="text-brand font-black">{countdown}</span> seconds...
          </div>
          <div className="w-full h-1.5 bg-secondary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
