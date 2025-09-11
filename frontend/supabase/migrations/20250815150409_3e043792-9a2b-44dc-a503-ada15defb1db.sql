-- Create lister types and update commission structure
CREATE TYPE public.lister_type AS ENUM ('individual_affiliate', 'company');

-- Update companies table to support lister type
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS lister_type lister_type DEFAULT 'company';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 3.00;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Create individual affiliate listers table
CREATE TABLE public.affiliate_listers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  aadhaar_verified boolean DEFAULT false,
  commission_rate numeric DEFAULT 1.00,
  total_deals integer DEFAULT 0,
  total_earnings bigint DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for affiliate_listers
ALTER TABLE public.affiliate_listers ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliate_listers
CREATE POLICY "Users can manage their own affiliate profile" 
ON public.affiliate_listers 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Affiliate listers are viewable by everyone" 
ON public.affiliate_listers 
FOR SELECT 
USING (is_active = true);

-- Create property_searches table for WhatsApp notifications
CREATE TABLE public.property_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_criteria JSONB NOT NULL, -- location, budget, property_type, etc.
  phone TEXT NOT NULL,
  is_active boolean DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for property_searches
ALTER TABLE public.property_searches ENABLE ROW LEVEL SECURITY;

-- Create policies for property_searches
CREATE POLICY "Users can manage their own searches" 
ON public.property_searches 
FOR ALL 
USING (user_id = auth.uid());

-- Update properties table to include lister information
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lister_type lister_type;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lister_id UUID;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lister_commission_rate numeric DEFAULT 1.00;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS buyer_commission_rate numeric DEFAULT 2.50;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seller_commission_rate numeric DEFAULT 1.50;

-- Create property contacts table for direct calling feature
CREATE TABLE public.property_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL, -- 'call', 'whatsapp', 'email'
  contact_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for property_contacts
ALTER TABLE public.property_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for property_contacts
CREATE POLICY "Property owners can view contacts for their properties" 
ON public.property_contacts 
FOR SELECT 
USING (property_id IN (
  SELECT id FROM properties 
  WHERE company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Users can create property contacts" 
ON public.property_contacts 
FOR INSERT 
WITH CHECK (buyer_id = auth.uid());

-- Update profiles table to support Google OAuth
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_method TEXT DEFAULT 'phone'; -- 'phone', 'google', 'both'

-- Add triggers for updated_at
CREATE TRIGGER update_affiliate_listers_updated_at
  BEFORE UPDATE ON public.affiliate_listers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_searches_updated_at
  BEFORE UPDATE ON public.property_searches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_properties_lister_type ON public.properties(lister_type);
CREATE INDEX idx_properties_location ON public.properties(city, state);
CREATE INDEX idx_property_searches_criteria ON public.property_searches USING GIN(search_criteria);
CREATE INDEX idx_affiliate_listers_user_id ON public.affiliate_listers(user_id);
CREATE INDEX idx_property_contacts_property_id ON public.property_contacts(property_id);
CREATE INDEX idx_profiles_google_id ON public.profiles(google_id);