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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center animate-fade-in">
      {/* Success icon */}
      <div className="relative mx-auto mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
          <Check size={32} className="text-brand" strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-secondary">Submission Successful</h2>
        <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
          Your submission was successful.
        </p>
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
  );
};
