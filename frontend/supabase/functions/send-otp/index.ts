import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OTPRequest {
  phoneNumber: string;
  action: 'send' | 'verify';
  otp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, action, otp }: OTPRequest = await req.json();

    if (action === 'send') {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clean up any existing OTPs for this phone number
      await supabase
        .from('phone_verification')
        .delete()
        .eq('phone_number', phoneNumber);

      // Store OTP in database
      const { error: dbError } = await supabase
        .from('phone_verification')
        .insert({
          phone_number: phoneNumber,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to generate OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In production, integrate with SMS service (Twilio, MSG91, etc.)
      // For development, we'll just return success
      console.log(`OTP for ${phoneNumber}: ${otpCode}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully',
          // Remove this in production
          devOtp: otpCode 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      if (!otp) {
        return new Response(
          JSON.stringify({ error: 'OTP code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify OTP
      const { data: verification, error: verifyError } = await supabase
        .from('phone_verification')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('otp_code', otp)
        .gt('expires_at', new Date().toISOString())
        .eq('is_verified', false)
        .maybeSingle();

      if (verifyError || !verification) {
        // Update attempts
        await supabase
          .from('phone_verification')
          .update({ attempts: (verification?.attempts || 0) + 1 })
          .eq('phone_number', phoneNumber)
          .eq('otp_code', otp);

        return new Response(
          JSON.stringify({ error: 'Invalid or expired OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark OTP as verified
      await supabase
        .from('phone_verification')
        .update({ is_verified: true })
        .eq('id', verification.id);

      return new Response(
        JSON.stringify({ success: true, message: 'Phone number verified successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});