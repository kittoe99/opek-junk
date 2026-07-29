export const SMS_MARKETING_CONSENT_TEXT =
  'I agree to receive marketing texts and special offers from Opek Junk Removal. Msg frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe, HELP for help.';

export const SMS_TRANSACTIONAL_NOTICE =
  'By providing your number, you agree to receive service texts from Opek Junk Removal about this quote or booking: status updates, appointment reminders, requested payment links, and support replies. Msg & data rates may apply.';

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
    return {
      ...base,
      sms_marketing_consent: false,
    };
  }

  return {
    ...base,
    sms_marketing_consent: true,
    sms_marketing_consent_at: consentAt,
    sms_marketing_consent_text: SMS_MARKETING_CONSENT_TEXT,
  };
}
