import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

let client: MongoClient | null = null

async function getMongoClient() {
  if (!client) {
    const mongoUri = Deno.env.get('MONGODB_URI') || 'mongodb+srv://durgaprashadreddy9966_db_user:68b3rkQPaCw2EPgr@realcox.scgtscp.mongodb.net/?retryWrites=true&w=majority&appName=realcox'
    client = new MongoClient()
    await client.connect(mongoUri)
  }
  return client
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const client = await getMongoClient()
    const db = client.database('realcox')
    const requirements = db.collection('requirements')

    if (req.method === 'POST') {
      // Store form submission
      const formData = await req.json()
      
      const requirement = {
        ...formData,
        submittedAt: new Date(),
        status: 'new'
      }
      
      const result = await requirements.insertOne(requirement)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { _id: result, ...requirement }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201 
        }
      )
    }

    if (req.method === 'GET') {
      // Get all requirements for admin
      const requirementsList = await requirements.find({}).sort({ submittedAt: -1 }).toArray()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: requirementsList 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('MongoDB Requirements Error:', error)
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