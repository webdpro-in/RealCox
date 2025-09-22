import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Phone, Building2, Home, MessageCircle } from 'lucide-react'
import { getLands } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Land {
  _id: string
  title: string
  location: string
  priceRange: string
  features: string
  description: string
  type: string
  companyId: string
  companyName?: string
  whatsappNumber?: string
}

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Land | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPropertyDetails()
  }, [id])

  const fetchPropertyDetails = async () => {
    try {
      const result = await getLands()
      if (result.success) {
        const foundProperty = result.data.find((land: Land) => land._id === id)
        if (foundProperty) {
          setProperty(foundProperty)
        } else {
          toast({
            title: 'Property Not Found',
            description: 'The requested property could not be found.',
            variant: 'destructive'
          })
          navigate('/')
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load property details',
        variant: 'destructive'
      })
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleContactWhatsApp = () => {
    if (!property) return

    const message = `🏠 *Property Inquiry from RealCox Website*

🏢 *Property:* ${property.title}
📍 *Location:* ${property.location}
💰 *Price:* ${property.priceRange}
🏢 *Company:* ${property.companyName || 'N/A'}

I would like to know more details about this property. Please contact me.`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = property.whatsappNumber || '+919966215578'
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleCallNow = () => {
    if (!property) return
    const phoneNumber = property.whatsappNumber || '+919966215578'
    window.open(`tel:${phoneNumber}`, '_self')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details - Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      {property.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {property.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Price Range</h3>
                    <p className="text-2xl font-bold text-primary">{property.priceRange}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.split(',').map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-primary" />
                          <span className="text-sm">{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Info */}
                  {property.companyName && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Listed By</h3>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <span className="font-medium">{property.companyName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Contact for Details
                </CardTitle>
                <CardDescription>
                  Get in touch to know more about this property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={handleContactWhatsApp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Inquiry
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCallNow}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-2">Property ID</h4>
                  <p className="text-sm text-muted-foreground break-all">{property._id}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contact Number</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.whatsappNumber || '+91 99662 15578'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PropertyDetails