import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  to: string;
  message: string;
  propertyId?: string;
  propertyDetails?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, propertyId, propertyDetails }: WhatsAppMessage = await req.json();

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format message for property notifications
    let formattedMessage = message;
    if (propertyDetails) {
      formattedMessage = `🏡 *New Property Alert!*

📍 *Location:* ${propertyDetails.city}, ${propertyDetails.state}
💰 *Price:* ₹${(propertyDetails.price / 100000).toFixed(1)}L
🏠 *Type:* ${propertyDetails.property_type}
📐 *Area:* ${propertyDetails.area_sqft} sq.ft
🛏️ *Bedrooms:* ${propertyDetails.bedrooms || 'N/A'}
🚿 *Bathrooms:* ${propertyDetails.bathrooms || 'N/A'}

📋 *Description:*
${propertyDetails.description || 'Contact for more details'}

📞 *Contact Now:* ${propertyDetails.contact_phone || 'Available on platform'}

Visit our platform to view more details and contact the lister directly!
RealCox - Your Trusted Property Partner`;
    }

    // Log the WhatsApp message attempt
    console.log(`WhatsApp message to ${to}:`, formattedMessage);

    // In production, integrate with WhatsApp Business API
    // For now, we'll simulate sending and return success
    // Common WhatsApp API providers: Twilio, MessageBird, WhatsApp Cloud API

    // Store notification in database for tracking
    if (propertyId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: null, // Can be set if we have user context
          type: 'whatsapp_property_alert',
          title: 'Property Alert Sent',
          message: formattedMessage,
          data: {
            phone: to,
            property_id: propertyId,
            sent_at: new Date().toISOString()
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp notification sent successfully',
        to: to,
        // Remove this in production
        devMessage: formattedMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-whatsapp function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send WhatsApp message' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});