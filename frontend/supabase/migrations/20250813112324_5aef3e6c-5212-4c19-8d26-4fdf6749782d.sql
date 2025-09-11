-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'company', 'buyer', 'seller', 'affiliate')),
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  established_year INTEGER,
  rera_number TEXT,
  rera_certificate_url TEXT,
  license_number TEXT,
  total_projects INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium')),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'house', 'plot', 'commercial', 'office')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'under_offer')),
  price BIGINT NOT NULL,
  area_sqft INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities TEXT[],
  images TEXT[],
  video_tour_url TEXT,
  virtual_tour_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  affiliate_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'viewing', 'negotiating', 'closed', 'lost')),
  lead_score INTEGER DEFAULT 0,
  message TEXT,
  phone TEXT,
  email TEXT,
  budget_min BIGINT,
  budget_max BIGINT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  affiliate_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  sale_price BIGINT NOT NULL,
  commission_rate DECIMAL(4,2) DEFAULT 3.00,
  total_commission BIGINT,
  seller_commission BIGINT,
  buyer_commission BIGINT,
  affiliate_commission BIGINT,
  platform_commission BIGINT,
  deal_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'disputed')),
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create affiliate_links table
CREATE TABLE public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  link_code TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  earnings BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lead', 'deal', 'commission', 'system')),
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for companies
CREATE POLICY "Companies are viewable by everyone"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own company"
  ON public.companies FOR ALL
  USING (user_id = auth.uid());

-- Create RLS policies for properties
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Company owners can manage their properties"
  ON public.properties FOR ALL
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Create RLS policies for leads
CREATE POLICY "Users can view their own leads"
  ON public.leads FOR SELECT
  USING (buyer_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()) OR affiliate_id = auth.uid());

CREATE POLICY "Users can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Company owners can update their leads"
  ON public.leads FOR UPDATE
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Create RLS policies for deals
CREATE POLICY "Users can view their own deals"
  ON public.deals FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR 
         company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()) OR 
         affiliate_id = auth.uid());

-- Create RLS policies for affiliate_links
CREATE POLICY "Affiliates can manage their own links"
  ON public.affiliate_links FOR ALL
  USING (affiliate_id = auth.uid());

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_properties_company_id ON public.properties(company_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_leads_property_id ON public.leads(property_id);
CREATE INDEX idx_leads_buyer_id ON public.leads(buyer_id);
CREATE INDEX idx_leads_company_id ON public.leads(company_id);
CREATE INDEX idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Create function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate commissions
CREATE OR REPLACE FUNCTION public.calculate_commission(sale_price BIGINT, commission_rate DECIMAL)
RETURNS JSONB AS $$
DECLARE
  total_commission BIGINT;
  seller_commission BIGINT;
  buyer_commission BIGINT;
  affiliate_commission BIGINT;
  platform_commission BIGINT;
BEGIN
  total_commission := (sale_price * commission_rate / 100)::BIGINT;
  seller_commission := (total_commission * 0.5)::BIGINT; -- 1.5% of sale price
  buyer_commission := (total_commission * 0.33)::BIGINT; -- 1% of sale price
  affiliate_commission := (total_commission * 0.17)::BIGINT; -- 0.5% of sale price
  platform_commission := total_commission - seller_commission - buyer_commission - affiliate_commission;
  
  RETURN jsonb_build_object(
    'total_commission', total_commission,
    'seller_commission', seller_commission,
    'buyer_commission', buyer_commission,
    'affiliate_commission', affiliate_commission,
    'platform_commission', platform_commission
  );
END;
$$ LANGUAGE plpgsql;