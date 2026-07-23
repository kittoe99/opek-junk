import React from 'react';
import { SubmissionSuccessView, SummaryRow } from './SubmissionSuccessView';

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
  addressB?: string;
  unitNumberB?: string | null;
  cityB?: string;
  stateB?: string;
  zipCodeB?: string;
  date: string;
  details?: string;
  price?: number | null;
  itemsDetected?: string[];
  estimatedVolume?: string;
  depositPaid?: number | null;
  fullScreen?: boolean;
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
  addressB,
  unitNumberB,
  cityB,
  stateB,
  zipCodeB,
  date,
  details,
  price,
  itemsDetected,
  estimatedVolume,
  depositPaid,
  fullScreen = true,
}) => {
  const formattedDate = React.useMemo(() => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  }, [date]);

  const fullAddress = [
    address,
    unitNumber ? `Unit ${unitNumber}` : null,
    [city, state, zipCode].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join(', ');

  const fullAddressB = addressB
    ? [
        addressB,
        unitNumberB ? `Unit ${unitNumberB}` : null,
        [cityB, stateB, zipCodeB].filter(Boolean).join(', '),
      ]
        .filter(Boolean)
        .join(', ')
    : null;

  const summary: SummaryRow[] = [
    { label: 'Service', value: serviceType },
    { label: 'Name', value: name },
    { label: 'Phone', value: phone },
    { label: 'Email', value: email },
    { label: addressB ? 'Pickup' : 'Address', value: fullAddress },
    ...(fullAddressB ? [{ label: 'Drop-off', value: fullAddressB }] : []),
    { label: 'Date', value: formattedDate },
    ...(itemsDetected?.length
      ? [{ label: 'Items', value: itemsDetected.join(', ') }]
      : []),
    ...(estimatedVolume ? [{ label: 'Items', value: estimatedVolume }] : []),
    ...(price != null ? [{ label: 'Price', value: `$${price}` }] : []),
    ...(depositPaid != null ? [{ label: 'Deposit paid', value: `$${depositPaid}` }] : []),
    ...(details ? [{ label: 'Notes', value: details }] : []),
  ];

  return (
    <SubmissionSuccessView
      title="Booking submitted"
      description="We received your booking. A confirmation email will follow shortly."
      orderNumber={orderNumber}
      summary={summary}
      fullScreen={fullScreen}
    />
  );
};
