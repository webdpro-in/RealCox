-- Create Aadhaar verification table
CREATE TABLE public.aadhaar_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aadhaar_name TEXT NOT NULL,
  aadhaar_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create land registry/property details table
CREATE TABLE public.land_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  survey_number TEXT,
  khasra_number TEXT,
  plot_number TEXT,
  owner_name TEXT NOT NULL,
  property_type TEXT NOT NULL, -- 'agricultural', 'residential', 'commercial', 'industrial'
  area_sqft NUMERIC,
  area_acres NUMERIC,
  location_coordinates POINT,
  village TEXT,
  tehsil TEXT,
  district TEXT,
  state TEXT NOT NULL,
  pincode TEXT,
  registration_number TEXT,
  registration_date DATE,
  market_value BIGINT,
  annual_revenue BIGINT,
  land_classification TEXT, -- 'irrigated', 'non-irrigated', 'barren', etc.
  is_disputed BOOLEAN DEFAULT false,
  encumbrance_certificate_url TEXT,
  revenue_records_url TEXT,
  mutation_records_url TEXT,
  is_active BOOLEAN DEFAULT true,
  fetched_from_api BOOLEAN DEFAULT false,
  api_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create phone verification table for OTP tracking
CREATE TABLE public.phone_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update profiles table to include Aadhaar name
ALTER TABLE public.profiles 
ADD COLUMN aadhaar_name TEXT,
ADD COLUMN is_aadhaar_verified BOOLEAN DEFAULT false,
ADD COLUMN is_phone_verified BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.aadhaar_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verification ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for aadhaar_verification
CREATE POLICY "Users can view their own Aadhaar verification" 
ON public.aadhaar_verification 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own Aadhaar verification" 
ON public.aadhaar_verification 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own Aadhaar verification" 
ON public.aadhaar_verification 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for land_registry
CREATE POLICY "Users can view their own land records" 
ON public.land_registry 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own land records" 
ON public.land_registry 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own land records" 
ON public.land_registry 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for phone_verification (public for OTP verification)
CREATE POLICY "Phone verification is publicly accessible for OTP" 
ON public.phone_verification 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_aadhaar_verification_user_id ON public.aadhaar_verification(user_id);
CREATE INDEX idx_land_registry_user_id ON public.land_registry(user_id);
CREATE INDEX idx_land_registry_location ON public.land_registry USING GIST(location_coordinates);
CREATE INDEX idx_phone_verification_phone ON public.phone_verification(phone_number);
CREATE INDEX idx_phone_verification_expires ON public.phone_verification(expires_at);

-- Add triggers for updated_at
CREATE TRIGGER update_aadhaar_verification_updated_at
BEFORE UPDATE ON public.aadhaar_verification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_land_registry_updated_at
BEFORE UPDATE ON public.land_registry
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to clean expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.phone_verification 
  WHERE expires_at < now();
END;
$$;