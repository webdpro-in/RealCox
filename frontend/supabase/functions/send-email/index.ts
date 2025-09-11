import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string[];
  subject: string;
  template: 'lead_notification' | 'deal_confirmation' | 'commission_alert' | 'welcome' | 'property_inquiry';
  data: {
    userName?: string;
    propertyTitle?: string;
    companyName?: string;
    message?: string;
    amount?: string;
    leadId?: string;
    propertyId?: string;
    [key: string]: any;
  };
}

const getEmailTemplate = (template: string, data: any) => {
  const { userName, propertyTitle, companyName, message, amount } = data;
  
  const templates = {
    lead_notification: {
      subject: `New Property Inquiry - ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">RealCox</h1>
            <p style="color: white; margin: 5px 0;">New Property Inquiry</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">New Lead Alert!</h2>
            <p>Hello <strong>${companyName}</strong>,</p>
            <p>You have received a new inquiry for your property:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">${propertyTitle}</h3>
              <p><strong>Interested Buyer:</strong> ${userName}</p>
              <p><strong>Message:</strong> ${message || 'No specific message'}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://realcox.com/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Lead Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This is an automated message from RealCox. Please respond to the lead within 24 hours for best results.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 RealCox.com - India's Leading Real Estate Platform</p>
          </div>
        </div>
      `
    },
    
    deal_confirmation: {
      subject: `Deal Confirmed - Commission of ${amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Deal Confirmed!</h1>
            <p style="color: white; margin: 5px 0;">Commission Earned</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Congratulations!</h2>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Great news! A deal has been confirmed and you've earned a commission.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <h3 style="color: #4CAF50; margin-top: 0;">Commission Details</h3>
              <p><strong>Property:</strong> ${propertyTitle}</p>
              <p><strong>Commission Amount:</strong> ${amount}</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://realcox.com/dashboard" 
                 style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Commission Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Commission will be processed within 3-5 business days.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 RealCox.com - India's Leading Real Estate Platform</p>
          </div>
        </div>
      `
    },
    
    welcome: {
      subject: 'Welcome to RealCox - Your Real Estate Journey Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to RealCox!</h1>
            <p style="color: white; margin: 10px 0; font-size: 18px;">India's Leading Real Estate Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${userName}!</h2>
            <p>Welcome to RealCox! We're excited to have you join our community of property buyers, sellers, and real estate professionals.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">What you can do with RealCox:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>🏠 Browse thousands of verified properties</li>
                <li>🤝 Connect with RERA-certified companies</li>
                <li>💰 Earn commissions through our affiliate program</li>
                <li>📊 Get AI-powered property recommendations</li>
                <li>📱 Receive instant updates via WhatsApp</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://realcox.com/dashboard" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
                Explore Your Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Need help getting started? Contact our support team at support@realcox.com
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 RealCox.com - India's Leading Real Estate Platform</p>
            <p>📞 +91 9876543210 | ✉️ info@realcox.com</p>
          </div>
        </div>
      `
    }
  };
  
  return templates[template] || templates.lead_notification;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data }: EmailRequest = await req.json();
    
    if (!to || !to.length || !template) {
      return new Response(
        JSON.stringify({ error: 'Recipients and template are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailTemplate = getEmailTemplate(template, data);
    
    const emailResponse = await resend.emails.send({
      from: 'RealCox <noreply@realcox.com>',
      to: to,
      subject: subject || emailTemplate.subject,
      html: emailTemplate.html,
    });

    // Log email delivery
    if (data.leadId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: data.leadId,
          title: 'Email Sent',
          message: `Email delivered to ${to.join(', ')}`,
          type: 'system',
          data: { email_id: emailResponse.data?.id, template }
        });
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        status: 'sent'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});