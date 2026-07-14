import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Loader2, CalendarCheck, PackageCheck, ClipboardList, MapPin, User, Mail, Phone, Building2, MessageSquare, Map, Trash2, Calendar as CalendarIcon, MapPin as MapPinIcon, Image as ImageIcon, Camera, Upload, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MovingAccessType, MovingLaborOptions, QuoteEstimate } from '../types';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent, SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../lib/customerConsent';
import {
  buildLocationInfoPayload,
  toStoredMovingOptions,
} from '../lib/bookingPayloads';
import { BookingSuccessView } from './shared/BookingSuccessView';
import { BookingDepositPayment, BOOKING_DEPOSIT_AMOUNT } from './shared/BookingDepositPayment';
import { BookingDepositIntro } from './shared/BookingDepositIntro';
import { ScheduleDatePicker, TimeSlot, formatTimeSlotLabel } from './shared/ScheduleDatePicker';
import {
  ServiceAddressField,
  ServiceAddressValue,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';
import { FLOW_INPUT, FLOW_LABEL } from '../lib/flowPageLayout';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';
import { FlowSelectionCard } from './shared/flow/FlowSelectionCard';
import { FlowStickyNav } from './shared/flow/FlowStickyNav';

const MOVING_ACCESS_CHOICES: { id: MovingAccessType; label: string }[] = [
  { id: 'ground', label: 'Ground floor / street level' },
  { id: 'elevator', label: 'Elevator available' },
  { id: 'stairs', label: 'Stairs required' },
];

const MOVING_SCOPE_LABELS: Record<MovingLaborOptions['serviceScope'], string> = {
  both: 'Load & unload',
  loading: 'Loading only',
  unloading: 'Unloading only',
  rearrange: 'In-home rearrange',
};

interface BookingDetailsFormProps {
  estimate: QuoteEstimate | null;
  image: string | null;
  images?: string[];
  serviceType: string;
  defaultZip?: { city: string; state: string; zipCode: string };
  onBack?: () => void;
  backLabel?: string;
  prefilledName?: string;
  prefilledPhone?: string;
  partialBookingId?: string | null;
  smsMarketingConsentAt?: string | null;
  depositSource?: string;
  movingOptions?: MovingLaborOptions | null;
}

type DetailStep = 'contact' | 'schedule' | 'address' | 'photo' | 'review' | 'deposit' | 'payment';

export const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  estimate,
  image,
  images,
  serviceType,
  defaultZip,
  onBack,
  backLabel = 'Back',
  prefilledName,
  prefilledPhone,
  partialBookingId,
  smsMarketingConsentAt,
  depositSource = 'booking',
  movingOptions = null,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DetailStep>('contact');
  const [submitting, setSubmitting] = useState(false);
  const [localSmsMarketingConsentAt, setLocalSmsMarketingConsentAt] = useState<string | null>(
    smsMarketingConsentAt ?? null
  );
  const [localImage, setLocalImage] = useState<string | null>(image);
  const estimateImages = images?.length ? images : image ? [image] : [];
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPhotosForPersistence = () => {
    if (localImage) {
      return [localImage, ...estimateImages.filter((img) => img !== localImage)];
    }
    return estimateImages;
  };

  useEffect(() => {
    setLocalImage(image);
  }, [image]);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setLocalImage(compressedImage);
        setError(null);
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
  };
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [partialId, setPartialId] = useState<string | null>(partialBookingId || null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    if (partialBookingId) {
      setPartialId(partialBookingId);
    }
  }, [partialBookingId]);

  useEffect(() => {
    if (smsMarketingConsentAt) {
      setLocalSmsMarketingConsentAt(smsMarketingConsentAt);
    }
  }, [smsMarketingConsentAt]);

  const isMovingLabor =
    serviceType.toLowerCase().includes('moving') || serviceType === 'Moving Labor';

  const movingScope = movingOptions?.serviceScope ?? 'both';
  const needsPickupAddress =
    !isMovingLabor || movingScope === 'both' || movingScope === 'loading' || movingScope === 'rearrange';
  // Unloading-only uses the primary address fields as the unload destination.
  const unloadingUsesPrimaryAddress = isMovingLabor && movingScope === 'unloading';
  const showDualMovingAddresses = isMovingLabor && movingScope === 'both';

  const [addressValidated, setAddressValidated] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressBValidated, setAddressBValidated] = useState(false);
  const [addressBError, setAddressBError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: prefilledName || '',
    email: '',
    phone: prefilledPhone || '',
    address: '',
    unitNumber: '',
    city: defaultZip?.city || '',
    state: defaultZip?.state || '',
    zipCode: defaultZip?.zipCode || '',
    addressB: '',
    unitNumberB: '',
    cityB: defaultZip?.city || '',
    stateB: defaultZip?.state || '',
    zipCodeB: defaultZip?.zipCode || '',
    pickupAccess: null as MovingAccessType | null,
    pickupFlights: null as number | null,
    dropoffAccess: null as MovingAccessType | null,
    dropoffFlights: null as number | null,
    date: '',
    timeSlot: '' as TimeSlot | '',
    details: '',
  });

  useEffect(() => {
    if (prefilledName) {
      setFormData(prev => ({ ...prev, name: prefilledName }));
    }
  }, [prefilledName]);

  useEffect(() => {
    if (prefilledPhone) {
      setFormData(prev => ({ ...prev, phone: prefilledPhone }));
    }
  }, [prefilledPhone]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleAddressChange = (addressValue: ServiceAddressValue) => {
    setFormData((prev) => ({
      ...prev,
      address: addressValue.address,
      unitNumber: addressValue.unitNumber,
      city: addressValue.city,
      state: addressValue.state,
      zipCode: addressValue.zipCode,
    }));
  };

  const handleAddressBChange = (addressValue: ServiceAddressValue) => {
    setFormData((prev) => ({
      ...prev,
      addressB: addressValue.address,
      unitNumberB: addressValue.unitNumber,
      cityB: addressValue.city,
      stateB: addressValue.state,
      zipCodeB: addressValue.zipCode,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isJunkRemoval =
    serviceType.toLowerCase().includes('junk') || serviceType === 'Junk Removal';

  const buildMovingOptionsPayload = () => {
    if (!isMovingLabor || !movingOptions) return undefined;
    if (!formData.pickupAccess) {
      return toStoredMovingOptions(movingOptions);
    }
    const dropAccess = unloadingUsesPrimaryAddress
      ? formData.pickupAccess
      : showDualMovingAddresses && addressBValidated
        ? formData.dropoffAccess
        : null;
    return toStoredMovingOptions(movingOptions, {
      pickupAccess: formData.pickupAccess,
      pickupFlights: formData.pickupFlights,
      dropoffAccess: dropAccess,
      dropoffFlights: unloadingUsesPrimaryAddress
        ? formData.pickupFlights
        : addressBValidated
          ? formData.dropoffFlights
          : null,
    });
  };

  const formatAccessLabel = (access: MovingAccessType | null, flights: number | null) => {
    if (!access) return '—';
    if (access === 'stairs') {
      const n = flights ?? 1;
      return `Stairs (${n === 4 ? '4+' : n} flight${n === 1 ? '' : 's'})`;
    }
    if (access === 'elevator') return 'Elevator';
    return 'Ground floor';
  };

  const pickupAccessComplete =
    !isMovingLabor ||
    Boolean(
      formData.pickupAccess &&
      (formData.pickupAccess !== 'stairs' || formData.pickupFlights !== null)
    );
  const hasOptionalDropoff = showDualMovingAddresses && Boolean(formData.addressB.trim());
  const dropoffAccessComplete = Boolean(
    formData.dropoffAccess &&
    (formData.dropoffAccess !== 'stairs' || formData.dropoffFlights !== null)
  );
  const accessSelectionComplete =
    pickupAccessComplete &&
    (!hasOptionalDropoff || (addressBValidated && dropoffAccessComplete));

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Items: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      let currentPartialId = partialId;

      const photos = await persistBookingPhotos(
        getPhotosForPersistence(),
        `lead_${Date.now()}`
      );
      if (photos.photo_url && photos.photo_url !== localImage) {
        setLocalImage(photos.photo_url);
      }

      const customerInfo = withSmsMarketingConsent(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        localSmsMarketingConsentAt
      );

      const bookingDetails = withBookingPhotos(
        {
          service_type: normalizedServiceType,
