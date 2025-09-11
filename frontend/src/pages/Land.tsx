import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, TreePine, Building2, Factory, Home, Filter, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import landProperty from "@/assets/land-property.jpg";

const landProperties = [
  {
    id: 1,
    title: "Agricultural Farmland",
    location: "Nashik, Maharashtra",
    price: "₹8 Lakhs/acre",
    pricePerSqft: "₹184/sqft",
    type: "Agricultural",
    image: landProperty,
    area: "5 acres",
    description: "Fertile agricultural land with water source, suitable for grape cultivation.",
    featured: true,
    zoning: "Agricultural Zone",
    waterSource: "Borewell",
    roadAccess: "Concrete Road",
    electricity: "Available",
    nearbyLandmarks: ["Highway - 2 km", "Market - 5 km", "Railway Station - 12 km"],
  },
  {
    id: 2,
    title: "Residential Plot",
    location: "Sector 82, Gurgaon",
    price: "₹45 Lakhs",
    pricePerSqft: "₹15,000/sqft",
    type: "Residential",
    image: landProperty,
    area: "300 sqyds",
    description: "DTCP approved residential plot in developing sector with good infrastructure.",
    featured: true,
    zoning: "Residential Zone",
    waterSource: "Municipal Water",
    roadAccess: "60 Feet Road",
    electricity: "Available",
    nearbyLandmarks: ["Metro Station - 3 km", "School - 1 km", "Hospital - 2 km"],
  },
  {
    id: 3,
    title: "Industrial Plot",
    location: "Aurangabad, Maharashtra",
    price: "₹35 Lakhs",
    pricePerSqft: "₹800/sqft",
    type: "Industrial",
    image: landProperty,
    area: "2 acres",
    description: "MIDC approved industrial plot with excellent connectivity to ports.",
    featured: false,
    zoning: "Industrial Zone",
    waterSource: "MIDC Water",
    roadAccess: "40 Feet Road",
    electricity: "High Tension Available",
    nearbyLandmarks: ["Port - 25 km", "Highway - 5 km", "Railway - 8 km"],
  },
];

const landTypes = [
  { name: "Residential Plots", count: "2,500+ plots", icon: Home, color: "text-blue-600" },
  { name: "Agricultural Land", count: "1,800+ acres", icon: TreePine, color: "text-green-600" },
  { name: "Commercial Plots", count: "650+ plots", icon: Building2, color: "text-purple-600" },
  { name: "Industrial Land", count: "420+ acres", icon: Factory, color: "text-orange-600" },
];

const Land = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [landType, setLandType] = useState("");
  const [areaRange, setAreaRange] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(landProperties);

  useEffect(() => {
    document.title = "Land & Plots for Sale in India - RealCox.com | Agricultural, Residential, Industrial";
  }, []);

  const handleSearch = () => {
    let filtered = landProperties;
    
    if (searchLocation) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    if (landType && landType !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === landType.toLowerCase()
      );
    }
    
    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Land & Plots in
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}India
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover prime land opportunities across India. From agricultural farmland to 
              residential plots, commercial sites to industrial zones - find the perfect land for your needs.
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-premium max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input 
                placeholder="Enter city, district, or area..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="h-12"
              />
              <Select value={landType} onValueChange={setLandType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Land Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Land Types</SelectItem>
                  <SelectItem value="residential">Residential Plots</SelectItem>
                  <SelectItem value="agricultural">Agricultural Land</SelectItem>
                  <SelectItem value="commercial">Commercial Plots</SelectItem>
                  <SelectItem value="industrial">Industrial Land</SelectItem>
                </SelectContent>
              </Select>
              <Select value={areaRange} onValueChange={setAreaRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Area Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1000">Under 1000 sqft</SelectItem>
                  <SelectItem value="1000-5000">1000 - 5000 sqft</SelectItem>
                  <SelectItem value="5000-1acre">5000 sqft - 1 acre</SelectItem>
                  <SelectItem value="1-5acre">1 - 5 acres</SelectItem>
                  <SelectItem value="5acre-plus">5+ acres</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="hero" className="h-12" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search Land
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Land Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Land Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <type.icon className={`w-10 h-10 ${type.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Land Listings */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {filteredProperties.length} Land Properties Available
            </h2>
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area-large">Area: Large to Small</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.featured && (
                      <Badge variant="secondary">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/90">
                      {property.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white">
                      <div className="text-lg font-bold">{property.price}</div>
                      <div className="text-sm text-white/80">{property.pricePerSqft}</div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-3 text-sm">
                    {property.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{property.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zoning:</span>
                      <span className="font-medium">{property.zoning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water:</span>
                      <span className="font-medium">{property.waterSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Road:</span>
                      <span className="font-medium">{property.roadAccess}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Nearby Landmarks:</h4>
                    <div className="space-y-1">
                      {property.nearbyLandmarks.slice(0, 2).map((landmark, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {landmark}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="hero" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact Owner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="premium" size="lg">
              Load More Land Properties
            </Button>
          </div>
        </div>
      </section>
      
      {/* Investment Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Invest in Land?</h2>
            <p className="text-xl text-muted-foreground">
              Land investment offers unique advantages for long-term wealth creation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Appreciation</h3>
                <p className="text-muted-foreground text-sm">
                  Land values typically appreciate over time, offering excellent long-term returns
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Tangible Asset</h3>
                <p className="text-muted-foreground text-sm">
                  Land is a physical asset that provides security and stability to your portfolio
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Development Potential</h3>
                <p className="text-muted-foreground text-sm">
                  Opportunity to develop or sell to developers for substantial profits
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-3">Tax Benefits</h3>
                <p className="text-muted-foreground text-sm">
                  Agricultural land investments offer various tax advantages and exemptions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Land;