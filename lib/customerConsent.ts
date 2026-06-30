export const SMS_MARKETING_CONSENT_TEXT =
  'Optional: I agree to receive promotional text messages from Opek Junk Removal. Message frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe, HELP for help.';

export const SMS_TRANSACTIONAL_NOTICE =
  'We will use your phone number to contact you about this quote or booking.';

export interface CustomerInfoPayload {
  name: string;
  phone: string;
  email: string;
  sms_marketing_consent?: boolean;
  sms_marketing_consent_at?: string;
  sms_marketing_consent_text?: string;
}

export function withSmsMarketingConsent(
  info: { name: string; phone: string; email?: string },
  consentAt: string | null | undefined
): CustomerInfoPayload {
  const base: CustomerInfoPayload = {
    name: info.name,
    phone: info.phone,
    email: info.email ?? '',
  };

  if (!consentAt) {
    return base;
  }

  return {
    ...base,
    sms_marketing_consent: true,
    sms_marketing_consent_at: consentAt,
    sms_marketing_consent_text: SMS_MARKETING_CONSENT_TEXT,
  };
}
