import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, Users, Wifi, Car, Filter, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import commercialBuilding from "@/assets/commercial-building.jpg";

const commercialProperties = [
  {
    id: 1,
    title: "Premium Office Space",
    location: "Cyber City, Gurgaon",
    price: "₹120/sqft/month",
    salePrice: "₹15,000/sqft",
    type: "Office",
    image: commercialBuilding,
    area: "5,000 sqft",
    parking: "20 cars",
    description: "Grade A office space with modern amenities in prime business district.",
    featured: true,
    possession: "Ready to move",
    amenities: ["Central AC", "High Speed Internet", "24/7 Security", "Power Backup", "Cafeteria"],
    furnishing: "Furnished",
    floor: "8th Floor",
    totalFloors: "25",
  },
  {
    id: 2,
    title: "Retail Showroom",
    location: "Connaught Place, Delhi",
    price: "₹250/sqft/month",
    salePrice: "₹35,000/sqft",
    type: "Retail",
    image: commercialBuilding,
    area: "2,500 sqft",
    parking: "5 cars",
    description: "Prime retail space in heart of Delhi with high foot traffic.",
    featured: true,
    possession: "Immediate",
    amenities: ["Street Facing", "Corner Shop", "Metro Connectivity", "Parking"],
    furnishing: "Unfurnished",
    floor: "Ground Floor",
    totalFloors: "4",
  },
  {
    id: 3,
    title: "Warehouse & Logistics Hub",
    location: "Bhiwandi, Mumbai",
    price: "₹25/sqft/month",
    salePrice: "₹3,500/sqft",
    type: "Warehouse",
    image: commercialBuilding,
    area: "25,000 sqft",
    parking: "50 trucks",
    description: "Large warehouse facility with excellent connectivity to ports and highways.",
    featured: false,
    possession: "Under construction",
    amenities: ["Loading Docks", "High Ceiling", "Security", "Highway Access"],
    furnishing: "Unfurnished",
    floor: "Ground Floor",
    totalFloors: "1",
  },
];

const commercialTypes = [
  { name: "Office Space", count: "1,200+ properties", icon: Building },
  { name: "Retail Shops", count: "850+ properties", icon: Building },
  { name: "Warehouses", count: "650+ properties", icon: Building },
  { name: "Industrial Land", count: "450+ properties", icon: Building },
  { name: "Restaurants", count: "320+ properties", icon: Building },
  { name: "Hotels", count: "180+ properties", icon: Building },
];

const Commercial = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("rent");
  const [filteredProperties, setFilteredProperties] = useState(commercialProperties);

  useEffect(() => {
    document.title = "Commercial Properties in India - RealCox.com | Office, Retail, Warehouse Spaces";
  }, []);

  const handleSearch = () => {
    let filtered = commercialProperties;
    
    if (searchLocation) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    if (propertyType && propertyType !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === propertyType.toLowerCase()
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
              Commercial Properties in
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}India
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find the perfect commercial space for your business. Office spaces, retail shops, 
              warehouses, and industrial properties across major Indian cities.
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-premium max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input 
                placeholder="Enter city or locality..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="h-12"
              />
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Commercial</SelectItem>
                  <SelectItem value="office">Office Space</SelectItem>
                  <SelectItem value="retail">Retail Shop</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Buy/Rent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="hero" className="h-12" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Commercial Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Property Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {commercialTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <type.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Properties Listing */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {filteredProperties.length} Commercial Properties
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
                More Filters
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
                      <div className="text-lg font-bold">
                        {transactionType === "rent" ? property.price : property.salePrice}
                      </div>
                      <div className="text-sm text-white/80">{property.area}</div>
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
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{property.floor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      <span>{property.parking}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{property.furnishing}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{property.possession}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="hero" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="premium" size="lg">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>
      
      {/* Investment Insights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Commercial Real Estate Insights</h2>
            <p className="text-xl text-muted-foreground">
              Stay updated with the latest trends and opportunities in commercial real estate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Market Trends</h3>
                <p className="text-muted-foreground mb-4">
                  Commercial real estate prices have grown by 12% in major metros this year
                </p>
                <Button variant="outline">View Report</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Best Locations</h3>
                <p className="text-muted-foreground mb-4">
                  Discover emerging commercial hubs with high growth potential across India
                </p>
                <Button variant="outline">Explore Areas</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Investment Guide</h3>
                <p className="text-muted-foreground mb-4">
                  Learn about commercial property investment strategies and tax benefits
                </p>
                <Button variant="outline">Download Guide</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Commercial;