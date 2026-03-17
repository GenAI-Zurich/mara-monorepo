
CREATE TABLE public.phone_verifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Allow edge functions (service role) full access, no public access needed
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- Clean up expired codes periodically - no RLS policies needed as only edge functions access this via service role
