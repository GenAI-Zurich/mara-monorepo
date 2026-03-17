
-- Update profiles: set phone_verified = true when phone is verified via OTP
-- This will be called after successful OTP verification during signup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;
