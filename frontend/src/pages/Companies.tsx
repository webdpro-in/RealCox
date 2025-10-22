import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Search,
  Home
} from "lucide-react";
import { getCompanies } from "@/lib/api";
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

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    document.title = "Real Estate Companies - RealCox.com | Find Verified Property Developers";
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      if (response.success) {
        setCompanies(response.data);
      } else {
        console.error('Error fetching companies:', response.message);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !cityFilter || company.location?.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  const handleContactCompany = (company: Company) => {
    const message = `Hi, I'm interested in learning more about ${company.name}. Can you provide more details about your properties?`;
    const cleanNumber = String(company.contact || '').replace(/\D/g, '');
    openWhatsApp(cleanNumber, message);
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

  const handleViewProperties = (companyId: string) => {
    window.location.href = `/company/${companyId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Verified Real Estate
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {" "}Companies
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with trusted property developers, builders, and real estate companies across India. 
            All companies are RERA verified for your safety.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Companies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCompanies.length} companies found
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {company.logoUrl ? (
                        <img 
                          src={company.logoUrl} 
                          alt={company.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                        <Badge variant="default" className="text-xs">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description || "Trusted real estate company providing quality properties."}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{company.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{company.contact}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{company.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProperties(company._id)}
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Properties
                  </Button>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => handleContactCompany(company)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">WhatsApp Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all companies.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setCityFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Companies;