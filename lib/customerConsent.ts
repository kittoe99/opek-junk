export const SMS_MARKETING_CONSENT_TEXT =
  'By checking this box, you agree that Opek Junk Removal may contact and send you offers via SMS or Phone. You can opt out at any time.';

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
