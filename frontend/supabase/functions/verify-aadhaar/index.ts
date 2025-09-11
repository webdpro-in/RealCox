import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AadhaarRequest {
  aadhaarName: string;
  aadhaarNumber?: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { aadhaarName, aadhaarNumber, userId }: AadhaarRequest = await req.json();

    if (!aadhaarName || !userId) {
      return new Response(
        JSON.stringify({ error: 'Aadhaar name and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In production, integrate with Aadhaar verification API
    // For development, we'll do basic validation
    const isValidName = aadhaarName.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(aadhaarName);
    
    if (!isValidName) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid name as per Aadhaar' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store Aadhaar verification
    const { error: dbError } = await supabase
      .from('aadhaar_verification')
      .upsert({
        user_id: userId,
        aadhaar_name: aadhaarName,
        aadhaar_number: aadhaarNumber || null,
        is_verified: true, // In production, this would be based on API response
        verification_date: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store Aadhaar verification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update profile with Aadhaar verification status
    await supabase
      .from('profiles')
      .update({
        aadhaar_name: aadhaarName,
        is_aadhaar_verified: true
      })
      .eq('user_id', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Aadhaar verification completed successfully',
        verified: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-aadhaar function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});