-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('commission', 'subscription', 'deal_payment')),
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  commission_id TEXT,
  subscription_id TEXT,
  description TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_views table for analytics
CREATE TABLE public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  view_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create search_history table
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  search_query TEXT,
  filters JSONB,
  results_count INTEGER DEFAULT 0,
  clicked_property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_favorites table
CREATE TABLE public.property_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create lead_activities table for tracking
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'contacted', 'viewed', 'proposal_sent', 'meeting_scheduled', 'closed', 'lost')),
  description TEXT,
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly BIGINT NOT NULL,
  price_yearly BIGINT NOT NULL,
  features JSONB NOT NULL,
  max_properties INTEGER,
  max_leads INTEGER,
  priority_support BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create company_subscriptions table
CREATE TABLE public.company_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (user_id = auth.uid());

-- RLS policies for property_views
CREATE POLICY "Property views are viewable by property owners"
  ON public.property_views FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

CREATE POLICY "Anyone can create property views"
  ON public.property_views FOR INSERT
  WITH CHECK (true);

-- RLS policies for search_history
CREATE POLICY "Users can view their own search history"
  ON public.search_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own search history"
  ON public.search_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS policies for property_favorites
CREATE POLICY "Users can manage their own favorites"
  ON public.property_favorites FOR ALL
  USING (user_id = auth.uid());

-- RLS policies for lead_activities
CREATE POLICY "Users can view lead activities for their leads"
  ON public.lead_activities FOR SELECT
  USING (lead_id IN (SELECT id FROM public.leads WHERE buyer_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can create lead activities"
  ON public.lead_activities FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- RLS policies for subscription_plans
CREATE POLICY "Subscription plans are viewable by everyone"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- RLS policies for company_subscriptions
CREATE POLICY "Companies can view their own subscriptions"
  ON public.company_subscriptions FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_viewer_id ON public.property_views(viewer_id);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_property_favorites_user_id ON public.property_favorites(user_id);
CREATE INDEX idx_property_favorites_property_id ON public.property_favorites(property_id);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_properties, max_leads) VALUES
('Free', 'Basic listing for small businesses', 0, 0, '["Basic property listing", "Email support", "Standard search visibility"]', 5, 20),
('Basic', 'Perfect for growing real estate businesses', 999, 9990, '["Unlimited property listings", "Priority support", "Enhanced search visibility", "Lead analytics"]', 50, 200),
('Premium', 'Advanced features for established companies', 2999, 29990, '["Everything in Basic", "WhatsApp integration", "AI-powered lead matching", "Custom branding", "Priority customer support"]', 200, 1000),
('Enterprise', 'Full-featured solution for large enterprises', 9999, 99990, '["Everything in Premium", "Dedicated account manager", "Custom integrations", "Advanced analytics", "White-label options"]', -1, -1);

-- Create triggers for updated_at
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at BEFORE UPDATE ON public.company_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to track property views
CREATE OR REPLACE FUNCTION public.track_property_view(
  property_id UUID,
  viewer_id UUID DEFAULT NULL,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  view_id UUID;
BEGIN
  INSERT INTO public.property_views (property_id, viewer_id, ip_address, user_agent)
  VALUES (property_id, viewer_id, ip_address, user_agent)
  RETURNING id INTO view_id;
  
  RETURN view_id;
END;
$$;