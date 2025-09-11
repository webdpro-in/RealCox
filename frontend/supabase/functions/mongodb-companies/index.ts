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
    try {
      await client.connect(mongoUri)
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('MongoDB connection failed:', error)
      client = null
      throw error
    }
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
    const companies = db.collection('companies')

    if (req.method === 'GET') {
      // Get all companies
      const companiesList = await companies.find({}).toArray()
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: companiesList 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (req.method === 'POST') {
      // Create new company
      const companyData = await req.json()
      
      const newCompany = {
        ...companyData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await companies.insertOne(newCompany)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { _id: result, ...newCompany }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201 
        }
      )
    }

    if (req.method === 'PUT') {
      // Update company
      const { id, ...updateData } = await req.json()
      
      const result = await companies.updateOne(
        { _id: { $oid: id } },
        { $set: { ...updateData, updatedAt: new Date() } }
      )
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: result 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (req.method === 'DELETE') {
      // Delete company
      const { id } = await req.json()
      
      const result = await companies.deleteOne({ _id: { $oid: id } })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: result 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('MongoDB Companies Error:', error)
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