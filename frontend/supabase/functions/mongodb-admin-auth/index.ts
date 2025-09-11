import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0"
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password } = await req.json()
    
    // Get admin credentials from environment
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'contact@webdpro.in'
    const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'pakalaravikumar99@A'
    
    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token (in production, use proper JWT)
      const token = btoa(`${email}:${Date.now()}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          token,
          message: 'Admin login successful'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid admin credentials'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Server error',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})