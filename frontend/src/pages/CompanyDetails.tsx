import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  Home,
  IndianRupee,
  Star,
  MessageCircle,
  Share2,
  Heart,
  Camera
} from "lucide-react";
import { getCompanies, getLands } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  contact: string;
  email: string;
  logoUrl?: string;
}

interface Land {
  _id: string;
  title: string;
  location: string;
  priceRange: string;
  features: string;
  description: string;
  type: string;
  companyId: string;
  whatsappNumber?: string;
  images?: string[];
}

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [properties, setProperties] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    if (!companyId) return;
    fetchCompanyData();
  }, [companyId]);

  const handleShare = async () => {
    if (!company) return;

    const companyUrl = `${window.location.origin}/company/${company._id}`;
    const shareData = {
      title: `Check out ${company.name} on RealCox`,
      text: `I found this real estate company on RealCox, check out their properties: ${company.name}`,
      url: companyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(companyUrl);
        toast({
          title: "Link Copied!",
          description: "Company URL copied to clipboard.",
        });
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Error",
          description: "Could not copy company link.",
          variant: "destructive",
        });
      }
    }
  };

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      
      // Fetch company details
      const companiesResponse = await getCompanies();
      if (companiesResponse.success) {
        const foundCompany = companiesResponse.data.find((c: Company) => c._id === companyId);
        setCompany(foundCompany || null);
        
        if (foundCompany) {
          document.title = `${foundCompany.name} - Properties & Details | RealCox.com`;
        }
      }

      // Fetch company properties
      const propertiesResponse = await getLands(companyId);
      if (propertiesResponse.success) {
        setProperties(propertiesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactProperty = (property: Land) => {
    const message = `Hi, I'm interested in ${property.title} located at ${property.location}. Can you provide more details?`;
    const phoneNumber = property.whatsappNumber || company?.contact;
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      openWhatsApp(cleanNumber, message);
    }
  };

  const handleContactCompany = () => {
    if (company) {
      const message = `Hi, I'm interested in learning more about ${company.name}. Can you provide more details about your properties?`;
      const cleanNumber = String(company.contact || '').replace(/\D/g, '');
      openWhatsApp(cleanNumber, message);
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading company details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The company you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/companies')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/companies')}
              className="text-muted-foreground hover:text-foreground"
            >
              Companies
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{company.name}</span>
          </nav>
        </div>
      </div>

      {/* Company Header */}
      <section className="py-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center p-4">
                {company.logoUrl ? (
                  <img 
                    src={company.logoUrl} 
                    alt={company.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                    <Badge variant="secondary">
                      <Home className="w-3 h-3 mr-1" />
                      {properties.length} Properties
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {company.description}
              </p>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleContactCompany}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp: {company.contact}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`mailto:${company.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {company.email}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Properties by {company.name}</h2>
              <p className="text-muted-foreground">
                Explore {properties.length} property listings from this company
              </p>
            </div>
          </div>

          {properties.length === 0 ? (
            <Card className="p-12 text-center">
              <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
              <p className="text-muted-foreground">
                This company hasn't listed any properties yet. Check back later!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property._id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    {/* Property Images */}
                    <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <div className="relative h-full">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {property.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {property.images.length}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 left-2 bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Home className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{property.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {property.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-lg font-bold text-primary mb-2">
                        <IndianRupee className="w-5 h-5" />
                        <span>{property.priceRange}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {property.features}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactProperty(property)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="hero" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyDetails;