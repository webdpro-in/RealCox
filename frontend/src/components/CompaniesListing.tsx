import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCompanies } from '@/lib/api'

interface Company {
  _id: string
  name: string
  description: string
  location: string
  contact: string
  email: string
  logoUrl: string
}

const CompaniesListing = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies()
        if (response.success) {
          setCompanies(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  console.log("CompaniesListing component is rendering...", { companies, loading });

  const openWhatsApp = (phoneNumber: string, message: string) => {
    try {
      // Ensure the phone number is properly formatted
      const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');
      
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
      <section className="py-20 bg-background" id="companies">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-primary">Companies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover trusted real estate companies offering premium properties worldwide
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background" id="companies">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover trusted real estate companies offering premium properties worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Companies Listed</h3>
              <p className="text-muted-foreground">
                Companies will appear here once they are added through the admin panel.
              </p>
            </div>
          ) : (
            companies.map((company) => (
              <Card key={company._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {company?.logoUrl ? (
                          <img 
                            src={company?.logoUrl} 
                            alt={company?.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{company?.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {company?.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{company?.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <a 
                        href={`https://wa.me/${String(company?.contact || '').replace(/\D/g, '')}?text=Hi, I would like to know about your properties`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        {company?.contact}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a 
                        href={`mailto:${company?.email}`}
                        className="text-primary hover:text-primary-glow transition-colors"
                      >
                        {company?.email}
                      </a>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Link to={`/company/${company._id}`}>
                          <Button className="w-full" variant="outline">
                            View Properties
                          </Button>
                        </Link>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            const message = `Hi, I would like to know about your properties`;
                            const cleanNumber = String(company.contact || '').replace(/\D/g, '');
                            openWhatsApp(cleanNumber, message);
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default CompaniesListing