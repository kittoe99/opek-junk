import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  UTILITY_FORM_CARD,
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PAGE_CONTENT,
  UTILITY_PAGE_SHELL,
  UTILITY_PRIMARY_BUTTON,
} from '../lib/flowPageLayout';
import { UtilityPageHeader } from './shared/UtilityPageHeader';

type PageState = 'form' | 'verify-email' | 'success';

interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  message?: string;
  full_name?: string;
  phone?: string;
  email?: string;
}

export const SignUpPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [pageState, setPageState] = useState<PageState>('form');
  const [checkingSession, setCheckingSession] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: searchParams.get('name') ?? '',
    email: searchParams.get('email') ?? '',
    phone: searchParams.get('phone') ?? '',
    password: '',
    confirmPassword: '',
  });

  const checkEligibility = useCallback(async (email: string): Promise<EligibilityResult | null> => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEligibility(null);
      return null;
    }

    setCheckingEligibility(true);
    try {
      const { data, error: rpcError } = await supabase.rpc('check_driver_signup_eligibility', {
        p_email: trimmed,
      });
      if (rpcError) throw rpcError;

      const result = data as EligibilityResult;
      setEligibility(result);

      if (result.eligible) {
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || result.full_name || '',
          phone: prev.phone || result.phone || '',
          email: result.email || prev.email,
        }));
      }

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not verify this email.';
      setEligibility({ eligible: false, reason: 'error', message });
      return { eligible: false, reason: 'error', message };
    } finally {
      setCheckingEligibility(false);
    }
  }, []);

  const completeAccountLink = useCallback(async (fullName: string, phone: string) => {
    const { error: registerError } = await supabase.rpc('register_driver', {
      p_full_name: fullName.trim(),
      p_phone: phone.trim(),
      p_states: [],
    });
    if (registerError) throw registerError;
    setPageState('success');
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;

        if (session) {
          const meta = session.user.user_metadata ?? {};
          const fullName = typeof meta.full_name === 'string' ? meta.full_name : formData.fullName;
          const phone = typeof meta.phone === 'string' ? meta.phone : formData.phone;

          await completeAccountLink(fullName, phone);
          return;
        }

        const emailFromUrl = searchParams.get('email');
        if (emailFromUrl) {
          setEmailLocked(true);
          await checkEligibility(emailFromUrl);
        }
      } catch {
        // Show the form if linking fails; user can retry after signing in.
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    checkExistingSession();
    return () => {
      cancelled = true;
    };
  }, [checkEligibility, completeAccountLink, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEligibility(null);
      setError(null);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email.trim() || emailLocked) return;
    await checkEligibility(formData.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await checkEligibility(formData.email);
      if (!result?.eligible) {
        setError(result?.message || 'This email is not approved for account creation yet.');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        await completeAccountLink(formData.fullName, formData.phone);
        return;
      }

      setPageState('verify-email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className={`${UTILITY_PAGE_SHELL} flex items-center justify-center`}>
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text)]" />
      </div>
    );
  }

  if (pageState === 'verify-email') {
    return (
      <div className={UTILITY_PAGE_SHELL}>
        <UtilityPageHeader
          eyebrow="Contractor account"
          title={<>Check your <span className="text-brand">email.</span></>}
          description="Confirm your email address to finish linking your approved contractor account."
        />
        <div className={UTILITY_PAGE_CONTENT}>
          <div className={`${UTILITY_FORM_CARD} max-w-lg mx-auto animate-fade-in`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 bg-secondary text-white rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-sans text-2xl font-semibold text-[var(--text)]">Confirm your email</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                  Click the link we sent to <span className="font-medium text-[var(--text)]">{formData.email}</span>.
                  After confirming, return to this page to finish setting up your account.
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Did not receive it? Check spam or contact{' '}
              <a href="mailto:Support@opekjunkremoval.com" className="text-brand hover:underline">
                Support@opekjunkremoval.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className={UTILITY_PAGE_SHELL}>
        <UtilityPageHeader
          eyebrow="Contractor account"
          title={<>You&apos;re <span className="text-brand">all set.</span></>}
          description="Your contractor login is linked. Sign in to the driver app with the email and password you just created."
        />
        <div className={UTILITY_PAGE_CONTENT}>
          <div className={`${UTILITY_FORM_CARD} max-w-lg mx-auto animate-fade-in space-y-6`}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-secondary text-white rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                You can now accept job offers in your approved service areas. Use the same email below when signing in.
              </p>
            </div>
            <dl className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sm:w-32 shrink-0">
                  Name
                </dt>
                <dd className="text-sm text-[var(--text)] break-words">{formData.fullName}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sm:w-32 shrink-0">
                  Email
                </dt>
                <dd className="text-sm text-[var(--text)] break-words">{formData.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  const eligibilityMessage =
    eligibility && !eligibility.eligible ? eligibility.message : null;
  const isEligible = eligibility?.eligible === true;
  const canSubmit = isEligible && !checkingEligibility && !submitting;

  return (
    <div className={UTILITY_PAGE_SHELL}>
      <UtilityPageHeader
        eyebrow="Contractor account"
        title={<>Create your <span className="text-brand">login.</span></>}
        description="Use the approved email from your welcome message to set a password and access the driver app."
      />

      <div className={UTILITY_PAGE_CONTENT}>
        <div className={`${UTILITY_FORM_CARD} max-w-lg mx-auto animate-fade-in`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={UTILITY_LABEL} htmlFor="email">
                Approved email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleEmailBlur}
                readOnly={emailLocked}
                required
                placeholder="you@example.com"
                className={`${UTILITY_INPUT}${emailLocked ? ' bg-white/[0.04] text-[var(--text-muted)]' : ''}`}
              />
              {checkingEligibility && (
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">Checking approval status…</p>
              )}
              {isEligible && (
                <p className="mt-1.5 text-xs text-emerald-700">Approved — you can create your account with this email.</p>
              )}
              {eligibilityMessage && (
                <p className="mt-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                  {eligibilityMessage}
                </p>
              )}
            </div>

            <div>
              <label className={UTILITY_LABEL} htmlFor="fullName">
                Full name *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="John Smith"
                className={UTILITY_INPUT}
              />
            </div>

            <div>
              <label className={UTILITY_LABEL} htmlFor="phone">
                Phone *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="(831) 318-7139"
                className={UTILITY_INPUT}
              />
            </div>

            <div>
              <label className={UTILITY_LABEL} htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className={UTILITY_INPUT}
              />
            </div>

            <div>
              <label className={UTILITY_LABEL} htmlFor="confirmPassword">
                Confirm password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={8}
                placeholder="Re-enter your password"
                className={UTILITY_INPUT}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button type="submit" disabled={!canSubmit} className={UTILITY_PRIMARY_BUTTON}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)] leading-relaxed">
            Haven&apos;t applied yet?{' '}
            <Link to="/provider-signup" className="text-brand hover:underline">
              Submit a provider application
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
