import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchRequest {
  userId: string;
  budget?: number;
  location?: string;
  propertyType?: string;
  bedrooms?: number;
  amenities?: string[];
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, budget, location, propertyType, bedrooms, amenities, description }: MatchRequest = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile for better matching
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get all available properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select(`
        *,
        companies(company_name, rating)
      `)
      .eq('is_active', true)
      .eq('status', 'available');

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch properties' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use OpenAI to analyze and match properties
    const userPreferences = {
      budget: budget || 'Not specified',
      location: location || profile?.city || 'Any location',
      propertyType: propertyType || 'Any type',
      bedrooms: bedrooms || 'Any',
      amenities: amenities || [],
      description: description || 'Looking for a suitable property'
    };

    const propertyDescriptions = properties?.map(property => ({
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.city}, ${property.state}`,
      type: property.property_type,
      bedrooms: property.bedrooms,
      amenities: property.amenities || [],
      description: property.description || '',
      company: property.companies?.company_name,
      rating: property.companies?.rating
    })) || [];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI real estate matching expert. Analyze user preferences and available properties to provide the best matches with detailed explanations. Return a JSON response with matched properties scored from 0-100.`
          },
          {
            role: 'user',
            content: `
User Preferences:
${JSON.stringify(userPreferences, null, 2)}

Available Properties:
${JSON.stringify(propertyDescriptions, null, 2)}

Please analyze and return the top 5 best matching properties with:
1. Match score (0-100)
2. Detailed explanation of why it matches
3. Key highlights
4. Any concerns or considerations

Format as JSON: {
  "matches": [
    {
      "propertyId": "uuid",
      "score": 95,
      "explanation": "why this property matches",
      "highlights": ["key benefit 1", "key benefit 2"],
      "considerations": ["potential concern if any"]
    }
  ]
}
            `
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      
      // Fallback to simple rule-based matching
      const fallbackMatches = properties?.slice(0, 5).map(property => ({
        propertyId: property.id,
        score: 75,
        explanation: `This property matches your general requirements in ${property.city}`,
        highlights: [`${property.property_type} in ${property.city}`, `Priced at ₹${property.price.toLocaleString()}`],
        considerations: ['Please review details to ensure it meets all your needs']
      })) || [];

      return new Response(
        JSON.stringify({ 
          matches: fallbackMatches,
          source: 'fallback_algorithm'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const matches = JSON.parse(aiResponse.choices[0].message.content);
    
    // Add property details to matches
    const enrichedMatches = matches.matches.map((match: any) => {
      const property = properties?.find(p => p.id === match.propertyId);
      return {
        ...match,
        property: property
      };
    });

    // Log the AI matching for analytics
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'AI Property Match Generated',
        message: `Found ${enrichedMatches.length} property matches`,
        type: 'system',
        data: { matchCount: enrichedMatches.length, preferences: userPreferences }
      });

    console.log('AI property matches generated:', enrichedMatches.length);
    
    return new Response(
      JSON.stringify({ 
        matches: enrichedMatches,
        source: 'ai_powered',
        preferences: userPreferences
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI property matching:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate property matches',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});