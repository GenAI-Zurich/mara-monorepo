import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Mail, Lock, Building2, Phone, ChevronRight, Loader2, User } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

interface AuthSplashProps {
  open: boolean;
  onClose?: () => void;
}

const AuthSplash = ({ open, onClose }: AuthSplashProps) => {
  const { signIn, refreshProfile, profile, user } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [step, setStep] = useState(1);

  const isProfileComplete = profile && profile.company_name;

  useEffect(() => {
    if (open && user && !isProfileComplete && step < 3) {
      setStep(3);
      setMode("register");
    }
  }, [open, user, isProfileComplete]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessRole, setBusinessRole] = useState("architect");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  const ROLES = [
    { value: "architect", label: t('role_architect') },
    { value: "light_planner", label: t('role_light_planner') },
    { value: "electrician", label: t('role_electrician') },
    { value: "dealer", label: t('role_dealer') },
    { value: "other", label: t('role_other') },
  ];

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setLoading(false);
  };

  const handleSendEmailOtp = async () => {
    if (!email.includes("@")) { setError(t('err_valid_email')); return; }
    setError("");
    setOtpSending(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStep(2);
    } catch (err: any) {
      setError(err.message || t('err_email_send'));
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtpCode.length !== 6) { setError(t('err_otp_6digits')); return; }
    setError("");
    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: emailOtpCode,
        type: "email",
      });
      if (verifyError) throw verifyError;
      setStep(3);
    } catch (err: any) {
      setError(err.message || t('err_otp_invalid'));
    } finally {
      setLoading(false);
    }
  };

  const resendEmailOtp = async () => {
    setError("");
    setOtpSending(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
    } catch (err: any) {
      setError(err.message || t('err_email_send'));
    } finally {
      setOtpSending(false);
    }
  };

  const handleFinishRegistration = async () => {
    if (!fullName.trim()) { setError(t('err_enter_name')); return; }
    if (!companyName.trim()) { setError(t('err_enter_company')); return; }
    if (password.length < 6) { setError(t('err_password_min6')); return; }
    setError("");
    setLoading(true);
    try {
      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) throw pwError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          full_name: fullName,
          company_name: companyName,
          business_role: businessRole,
        } as any).eq("id", user.id);
      }

      await refreshProfile();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('err_registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const stepTitle = () => {
    if (mode === "login") return t('login');
    switch (step) {
      case 1: return t('create_account');
      case 2: return t('verify_email');
      case 3: return t('your_details');
      default: return "";
    }
  };

  const stepSubtitle = () => {
    if (mode === "login") return t('login_subtitle');
    switch (step) {
      case 1: return t('register_step1_subtitle');
      case 2: return t('register_step2_subtitle', { email });
      case 3: return t('register_step3_subtitle');
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[24px]" />

        <motion.div
          className="relative w-[min(420px,90vw)] bg-card border border-border rounded-lg overflow-hidden shadow-[var(--shadow-deep)]"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="h-[2px]" style={{ background: "var(--gradient-gold)" }} />

          {mode === "register" && !success && (
            <div className="flex gap-1 px-8 pt-6">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-[2px] flex-1 rounded-full transition-all ${
                    s <= step ? "bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="px-8 py-6">
            {success ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={20} className="text-gold" />
                </div>
                <h2 className="font-display text-2xl font-light text-foreground mb-2">{t('welcome')}</h2>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {t('account_created')}
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-light text-foreground mb-1">
                  {stepTitle()}
                </h2>
                <p className="text-[12px] text-muted-foreground mb-6">
                  {stepSubtitle()}
                </p>

                {error && (
                  <div className="text-[12px] text-destructive bg-destructive/10 px-3 py-2 rounded mb-4">
                    {error}
                  </div>
                )}

                {mode === "login" ? (
                  <div className="flex flex-col gap-3">
                    <InputField icon={<Mail size={14} />} type="email" placeholder={t('email')} value={email} onChange={setEmail} />
                    <InputField icon={<Lock size={14} />} type="password" placeholder={t('password')} value={password} onChange={setPassword} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                    <PrimaryButton onClick={handleLogin} loading={loading}>{t('sign_in')}</PrimaryButton>
                  </div>

                ) : step === 1 ? (
                  <div className="flex flex-col gap-3">
                    <InputField icon={<Mail size={14} />} type="email" placeholder={t('email')} value={email} onChange={setEmail} onKeyDown={e => e.key === "Enter" && handleSendEmailOtp()} />
                    <PrimaryButton onClick={handleSendEmailOtp} loading={otpSending}>
                      {t('next')} <ChevronRight size={14} />
                    </PrimaryButton>
                  </div>

                ) : step === 2 ? (
                  <div className="flex flex-col gap-4 items-center">
                    <InputOTP maxLength={6} value={emailOtpCode} onChange={setEmailOtpCode}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    <div className="flex gap-2 w-full">
                      <BackButton onClick={() => { setStep(1); setEmailOtpCode(""); setError(""); }}>
                        {t('change_email')}
                      </BackButton>
                      <PrimaryButton onClick={handleVerifyEmailOtp} loading={loading} disabled={emailOtpCode.length !== 6} className="flex-1">
                        {t('confirm')}
                      </PrimaryButton>
                    </div>

                    <button
                      onClick={resendEmailOtp}
                      disabled={otpSending}
                      className="text-[11px] text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                    >
                      {otpSending ? t('sending') : t('resend_code')}
                    </button>
                  </div>

                ) : (
                  <div className="flex flex-col gap-3">
                    <InputField icon={<User size={14} />} type="text" placeholder={t('first_last_name')} value={fullName} onChange={setFullName} />
                    <InputField icon={<Building2 size={14} />} type="text" placeholder={t('company_name')} value={companyName} onChange={setCompanyName} />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-medium">{t('occupation')}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {ROLES.map(r => (
                          <button
                            key={r.value}
                            onClick={() => setBusinessRole(r.value)}
                            className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                              businessRole === r.value
                                ? "border-gold text-gold bg-gold/10"
                                : "border-border text-muted-foreground hover:border-gold/50"
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <InputField icon={<Lock size={14} />} type="password" placeholder={t('password_min6')} value={password} onChange={setPassword} onKeyDown={e => e.key === "Enter" && handleFinishRegistration()} />

                    <div className="flex gap-2">
                      <BackButton onClick={() => setStep(2)}>{t('back')}</BackButton>
                      <PrimaryButton onClick={handleFinishRegistration} loading={loading} className="flex-1">
                        {t('register')}
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                <div className="mt-5 text-center">
                  <button
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); setStep(1); setError(""); setEmailOtpCode(""); }}
                    className="text-[11px] text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                  >
                    {mode === "login" ? t('no_account') : t('already_registered')}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function InputField({
  icon, type, placeholder, value, onChange, onKeyDown,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex items-center gap-2.5 h-10 px-3 rounded-md border border-border bg-background transition-all focus-within:border-gold">
      <span className="text-muted-foreground flex-shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground font-body"
      />
    </div>
  );
}

function PrimaryButton({
  onClick, loading, disabled, className, children,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full h-10 rounded-md bg-gold text-primary-foreground text-[12px] tracking-[0.1em] uppercase font-medium transition-all hover:bg-gold-light disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${className ?? ""}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : children}
    </button>
  );
}

function BackButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-4 rounded-md border border-border text-muted-foreground text-[12px] tracking-[0.1em] uppercase transition-all hover:border-gold cursor-pointer"
    >
      {children}
    </button>
  );
}

export default AuthSplash;
