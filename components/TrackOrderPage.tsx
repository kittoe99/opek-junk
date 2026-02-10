import React, { useState } from 'react';
import { Search, MapPin, MapPinCheck, Calendar, Phone, Hash, ChevronRight, AlertCircle, CheckCircle, Circle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

interface BookingResult {
  id: string;
  order_number: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  service_type: string;
  preferred_date: string;
  status: string;
  created_at: string;
  estimated_volume: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
}

interface StatusHistoryItem {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  scheduled: { label: 'Scheduled', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  en_route: { label: 'En Route', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  in_progress: { label: 'In Progress', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
};

export const TrackOrderPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'phone' | 'order'>('phone');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<BookingResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<BookingResult | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchValue.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedOrder(null);
    setStatusHistory([]);
    setSearched(true);

    try {
      let query = supabase
        .from('bookings')
        .select('id, order_number, name, phone, address, city, state, zip_code, service_type, preferred_date, status, created_at, estimated_volume, price_range_min, price_range_max')
        .order('created_at', { ascending: false });

      if (searchType === 'phone') {
        const digits = value.replace(/\D/g, '');
        query = query.like('phone', `%${digits}%`);
      } else {
        const normalized = value.toUpperCase().trim();
        query = query.eq('order_number', normalized);
      }

      const { data, error: queryError } = await query.limit(10);

      if (queryError) throw queryError;
      setResults(data || []);
    } catch (err: any) {
      console.error('Track order error:', err);
      setError('Unable to look up your order. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (order: BookingResult) => {
    setSelectedOrder(order);
    setHistoryLoading(true);
    try {
      const { data, error: histError } = await supabase
        .from('order_status_history')
        .select('id, status, note, created_at')
        .eq('booking_id', order.id)
        .order('created_at', { ascending: true });

      if (histError) throw histError;
      setStatusHistory(data || []);
    } catch (err) {
      console.error('Failed to load status history:', err);
      setStatusHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatus = (status: string) => STATUS_MAP[status] || STATUS_MAP.pending;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Order detail view
  if (selectedOrder) {
    const s = getStatus(selectedOrder.status);
    return (
      <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[108px]">
        <Breadcrumb items={[{ label: 'Track Order', path: '/track-order' }, { label: selectedOrder.order_number }]} />
        <div className="py-16 md:py-20 lg:py-32">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => { setSelectedOrder(null); setStatusHistory([]); }}
              className="mb-8 text-sm font-bold text-gray-600 hover:text-black transition-colors"
            >
              ← Back to results
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                    <p className="text-lg font-mono font-black text-black">{selectedOrder.order_number}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.color}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Placed {formatDateTime(selectedOrder.created_at)}</p>
              </div>

              {/* Status Timeline */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Timeline</p>
                {historyLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} className="animate-spin" /> Loading timeline...
                  </div>
                ) : statusHistory.length > 0 ? (
                  <div className="relative">
                    {statusHistory.map((entry, i) => {
                      const isLast = i === statusHistory.length - 1;
                      const entryStatus = getStatus(entry.status);
                      return (
                        <div key={entry.id} className="flex gap-3 relative">
                          {/* Vertical line */}
                          {!isLast && (
                            <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-gray-200" />
                          )}
                          {/* Dot */}
                          <div className="relative z-10 mt-0.5 shrink-0">
                            {isLast ? (
                              <div className={`w-[18px] h-[18px] rounded-full ${entryStatus.dot} flex items-center justify-center`}>
                                {entry.status === 'completed' ? (
                                  <CheckCircle size={12} className="text-white" />
                                ) : (
                                  <Circle size={8} className="text-white fill-white" />
                                )}
                              </div>
                            ) : (
                              <div className="w-[18px] h-[18px] rounded-full bg-gray-200 flex items-center justify-center">
                                <CheckCircle size={12} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          <div className={`pb-5 ${isLast ? '' : ''}`}>
                            <p className={`text-sm font-bold ${isLast ? 'text-black' : 'text-gray-500'}`}>
                              {entryStatus.label}
                            </p>
                            {entry.note && (
                              <p className="text-xs text-gray-400 mt-0.5">{entry.note}</p>
                            )}
                            <p className="text-[11px] text-gray-300 mt-0.5">{formatDateTime(entry.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No timeline data available.</p>
                )}
              </div>

              {/* Details */}
              <div className="p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-sm font-bold text-black">{selectedOrder.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm font-bold text-black">{selectedOrder.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service Address</p>
                  <p className="text-sm font-bold text-black">
                    {selectedOrder.address}
                    {selectedOrder.city && `, ${selectedOrder.city}`}
                    {selectedOrder.state && `, ${selectedOrder.state}`}
                    {selectedOrder.zip_code && ` ${selectedOrder.zip_code}`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service Type</p>
                    <p className="text-sm font-bold text-black capitalize">{selectedOrder.service_type?.replace(/_/g, ' ') || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Preferred Date</p>
                    <p className="text-sm font-bold text-black">{selectedOrder.preferred_date ? formatDate(selectedOrder.preferred_date) : 'Not specified'}</p>
                  </div>
                </div>

                {(selectedOrder.price_range_min || selectedOrder.price_range_max) && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Price</p>
                    <p className="text-2xl font-black text-emerald-600">
                      ${selectedOrder.price_range_min} &ndash; ${selectedOrder.price_range_max}
                    </p>
                    {selectedOrder.estimated_volume && (
                      <p className="text-xs text-gray-400 mt-1">Volume: {selectedOrder.estimated_volume}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Questions about your order? Call us at <a href="tel:8313187139" className="font-bold text-black hover:underline">(831) 318-7139</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[108px]">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <div className="py-16 md:py-20 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MapPinCheck size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">Track Your Order</h1>
            <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
              Enter your phone number or order number to check the status of your booking.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm mb-8">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => { setSearchType('phone'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  searchType === 'phone' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                <Phone size={14} />
                Phone Number
              </button>
              <button
                onClick={() => { setSearchType('order'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  searchType === 'order' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                <Hash size={14} />
                Order Number
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch}>
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'phone' ? 'Enter your phone number' : 'e.g. OPK-A1B2C3'}
                  className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className="w-full py-3.5 bg-black text-white font-bold uppercase text-sm tracking-wider rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Results */}
          {searched && !loading && !error && (
            <div>
              {results.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-black mb-2">No Orders Found</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    We couldn't find any orders matching your {searchType === 'phone' ? 'phone number' : 'order number'}. Please double-check and try again.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {results.length} order{results.length !== 1 ? 's' : ''} found
                  </p>
                  {results.map((order) => {
                    const os = getStatus(order.status);
                    return (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className="w-full bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-bold text-black">{order.order_number}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${os.bg} ${os.color}`}>
                                {os.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              {order.service_type && (
                                <span className="capitalize">{order.service_type.replace(/_/g, ' ')}</span>
                              )}
                              {order.preferred_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={11} />
                                  {formatDate(order.preferred_date)}
                                </span>
                              )}
                              {order.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} />
                                  {order.city}, {order.state}
                                </span>
                              )}
                            </div>
                            {(order.price_range_min || order.price_range_max) && (
                              <p className="text-sm font-black text-emerald-600 mt-2">
                                ${order.price_range_min} &ndash; ${order.price_range_max}
                              </p>
                            )}
                          </div>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Help text */}
          {!searched && (
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Your order number (e.g. OPK-A1B2C3) was provided in your booking confirmation. If you don't have it, use your phone number instead.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
