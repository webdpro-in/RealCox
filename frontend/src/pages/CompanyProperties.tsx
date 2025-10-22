import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, ArrowLeft, Building2 } from 'lucide-react'
import { getCompanies, getLands } from '@/lib/api'

interface Company {
  _id: string
  name: string
  description: string
  location: string
  contact: string
  email: string
}

interface Property {
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
  images?: string[]
}

const CompanyProperties = () => {
  const { companyId } = useParams<{ companyId: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return

      try {
        const [companiesRes, propertiesRes] = await Promise.all([
          getCompanies(),
          getLands()
        ])

        if (companiesRes.success) {
          const selectedCompany = companiesRes.data.find((c: Company) => c._id === companyId)
          setCompany(selectedCompany || null)
        }

        if (propertiesRes.success) {
          const companyProperties = propertiesRes.data.filter((p: Property) => p.companyId === companyId)
          setProperties(companyProperties)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  const openWhatsApp = (phoneNumber: string, message: string) => {
    try {
      // Ensure the phone number is properly formatted
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      // Add country code if missing (assuming India +91)
      let formattedNumber = cleanNumber;
      if (cleanNumber.length === 10) {
        formattedNumber = `91${cleanNumber}`;
      } else if (cleanNumber.length === 11 && cleanNumber.startsWith('0')) {
        formattedNumber = `91${cleanNumber.substring(1)}`;
      } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
        formattedNumber = cleanNumber;
      }
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
      
      // Try to open WhatsApp app first (works on desktop if app is installed)
      const appUrl = `whatsapp://send?phone=${formattedNumber}&text=${encodedMessage}`;
      
      // Create a fallback mechanism
      const openWhatsAppApp = () => {
        window.location.href = appUrl;
        // Fallback to web version after a short delay
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1500);
      };
      
      // Check if user is on mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // On mobile, try to open the app directly
        openWhatsAppApp();
      } else {
        // On desktop, try app first, then web
        openWhatsAppApp();
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // Fallback: open a new tab with WhatsApp Web
      window.open(`https://web.whatsapp.com/`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested company could not be found.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-primary hover:text-primary-glow transition-colors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
        </div>

        {/* Company Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl mb-2">{company.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {company.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a 
                        href={`https://wa.me/${String(company.contact || '').replace(/\D/g, '')}?text=Hi, I would like to know about your properties`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        {company.contact}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Properties Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Properties by {company.name}
          </h2>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
              <p className="text-muted-foreground">
                This company hasn't listed any properties yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property._id} className="hover:shadow-lg transition-shadow duration-300">
                  {property.images && property.images.length > 0 && (
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={property?.images[0]} 
                        alt={property?.title}
                        className="w-full h-full object-cover"
                      />
                      {property.images.length > 1 && (
                        <Badge className="absolute top-2 right-2 bg-black/60 text-white">
                          +{property.images.length - 1} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                      <Badge variant="secondary" className="capitalize">
                        {property?.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{property.location}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-primary">
                        {property?.priceRange}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {property.description}
                      </p>
                      
                      <div className="text-sm">
                        <strong>Features:</strong>
                        <p className="text-muted-foreground line-clamp-2">{property.features}</p>
                      </div>

                      <div className="flex flex-col gap-2 pt-4 border-t">
                        <Link to={`/property/${property._id}`}>
                          <Button className="w-full" size="sm">
                            View Details
                          </Button>
                        </Link>
                        
                        {property.whatsappNumber && (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="sm"
                            onClick={() => {
                              const message = `Hi, I'm interested in ${property.title}`;
                              openWhatsApp(property.whatsappNumber!, message);
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact via WhatsApp
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CompanyProperties