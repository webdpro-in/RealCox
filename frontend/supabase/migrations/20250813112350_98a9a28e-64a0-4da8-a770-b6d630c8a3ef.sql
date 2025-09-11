-- Fix security warnings by adding proper search_path to functions

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix calculate_commission function
CREATE OR REPLACE FUNCTION public.calculate_commission(sale_price BIGINT, commission_rate DECIMAL)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;