import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  currency: string;
  dealId?: string;
  commissionId?: string;
  subscriptionId?: string;
  userId: string;
  description: string;
  type: 'commission' | 'subscription' | 'deal_payment';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'INR', dealId, commissionId, subscriptionId, userId, description, type }: PaymentRequest = await req.json();
    
    if (!amount || !userId || !type) {
      return new Response(
        JSON.stringify({ error: 'Amount, userId, and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Razorpay order
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const orderData = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        dealId: dealId || '',
        commissionId: commissionId || '',
        subscriptionId: subscriptionId || '',
        userId: userId,
        type: type,
        description: description
      }
    };

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      console.error('Razorpay API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = await razorpayResponse.json();
    
    // Store payment record in database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        razorpay_order_id: order.id,
        user_id: userId,
        amount: amount,
        currency: currency,
        status: 'created',
        type: type,
        deal_id: dealId,
        commission_id: commissionId,
        subscription_id: subscriptionId,
        description: description
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store payment record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment order created:', order);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
        paymentRecordId: paymentRecord.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process payment',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});