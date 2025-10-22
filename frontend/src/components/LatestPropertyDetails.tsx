import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee, Square, Phone, Building2 } from "lucide-react";
import { getLands, getCompanies } from "@/lib/api";
import { useNavigate } from 'react-router-dom';

interface Land {
  _id: string;
  title: string;
  location: string;
  priceRange: string;
  features: string;
  description: string;
  type: string;
  companyId: string;
  companyName?: string;
  whatsappNumber?: string;
  images?: string[];
}

interface Company {
  _id: string;
  name: string;
  contact: string;
  // other company properties
}

const LatestPropertyDetails = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both lands and companies
        const [landsResponse, companiesResponse] = await Promise.all([
          getLands(),
          getCompanies()
        ]);
        
        if (landsResponse.success) {
          // Get the latest 6 properties of any type
          const latestProperties = landsResponse.data
            .slice(0, 6); // Get the latest 6 properties
            
          setLands(latestProperties);
        }
        
        if (companiesResponse.success) {
          setCompanies(companiesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handlePropertyClick = (land: Land) => {
    // Find the company associated with this land
    const company = companies.find(c => c._id === land.companyId);
    
    if (company) {
      // Open company's WhatsApp
      const message = `Hi, I'm interested in ${land.title} located at ${land.location}. Can you provide more details?`;
      openWhatsApp(company.contact, message);
    } else {
      // Fallback to land's WhatsApp number if company not found
      if (land.whatsappNumber) {
        const message = `Hi, I'm interested in ${land.title} located at ${land.location}. Can you provide more details?`;
        openWhatsApp(land.whatsappNumber, message);
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Latest 
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}Property Details
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Loading latest property listings...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest 
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {" "}Property Details
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the latest property listings from verified real estate companies
          </p>
        </div>

        {lands.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Property Listings Available</h3>
            <p className="text-muted-foreground">
              New property listings will appear here once they are added by real estate companies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lands.map((land) => (
              <Card 
                key={land._id} 
                className="group hover:shadow-premium transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                onClick={() => handlePropertyClick(land)}
              >
                <div className="relative overflow-hidden">
                  {land.images && land.images.length > 0 ? (
                    <img 
                      src={land.images[0]} 
                      alt={land.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold">
                      {land.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary text-primary-foreground text-lg font-bold px-3 py-1">
                      {land.priceRange}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{land.location}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {land.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                    {land.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{land.features}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="hero" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        handlePropertyClick(land);
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPropertyDetails;