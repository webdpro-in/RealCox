import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bed, Bath, Square, Heart, Eye, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import villageHouse from "@/assets/village-house.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import landProperty from "@/assets/land-property.jpg";
import apartmentInterior from "@/assets/apartment-interior.jpg";

const buyProperties = [
  {
    id: 1,
    title: "3BHK Independent Villa",
    location: "Gurgaon, Haryana",
    price: "₹2.5 Crores",
    originalPrice: "₹2.8 Crores",
    type: "Residential",
    scale: "Local",
    image: villageHouse,
    beds: 3,
    baths: 3,
    sqft: "2,100",
    description: "Spacious villa in prime Gurgaon location with modern amenities and good connectivity.",
    featured: true,
    emi: "₹1.8 Lakhs/month",
    possession: "Ready to move",
    facing: "East",
  },
  {
    id: 2,
    title: "Commercial Office Space",
    location: "Bandra-Kurla Complex, Mumbai",
    price: "₹8.5 Crores",
    type: "Commercial",
    scale: "National",
    image: commercialBuilding,
    beds: null,
    baths: 2,
    sqft: "4,500",
    description: "Premium office space in Mumbai's financial district with metro connectivity.",
    featured: true,
    emi: "₹6.2 Lakhs/month",
    possession: "Under construction",
    facing: "North-West",
  },
  {
    id: 3,
    title: "Agricultural Farmland",
    location: "Nashik, Maharashtra",
    price: "₹45 Lakhs",
    type: "Land",
    scale: "Local",
    image: landProperty,
    beds: null,
    baths: null,
    sqft: "5 acres",
    description: "Fertile agricultural land suitable for grape cultivation near Nashik wine region.",
    featured: false,
    emi: "₹32,000/month",
    possession: "Immediate",
    facing: "South",
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    location: "Cyber City, Bangalore",
    price: "₹4.2 Crores",
    type: "Residential",
    scale: "National",
    image: apartmentInterior,
    beds: 4,
    baths: 5,
    sqft: "3,800",
    description: "Ultra-luxury penthouse with panoramic city views and premium amenities.",
    featured: true,
    emi: "₹3.1 Lakhs/month",
    possession: "Ready to move",
    facing: "West",
  },
];

const Buy = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(buyProperties);

  useEffect(() => {
    document.title = "Buy Properties in India - RealCox.com | Homes, Apartments, Commercial & Land";
  }, []);

  const handleSearch = () => {
    let filtered = buyProperties;
    
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
              Buy Property in
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}India
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your dream property across India. From independent villas to luxury apartments, 
              commercial spaces to agricultural land - all at the best prices.
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-premium max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input 
                placeholder="Enter city, locality or project name..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="h-12"
              />
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land & Plots</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50l">Under ₹50 Lakhs</SelectItem>
                  <SelectItem value="50l-1cr">₹50 Lakhs - ₹1 Crore</SelectItem>
                  <SelectItem value="1cr-2cr">₹1 - ₹2 Crores</SelectItem>
                  <SelectItem value="2cr-5cr">₹2 - ₹5 Crores</SelectItem>
                  <SelectItem value="5cr-plus">₹5+ Crores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button variant="hero" className="flex-1" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search Properties
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Properties Listing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {filteredProperties.length} Properties Found
            </h2>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
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
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/90">
                      {property.possession}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white">
                      <div className="text-lg font-bold">{property.price}</div>
                      {property.originalPrice && (
                        <div className="text-sm line-through text-white/70">{property.originalPrice}</div>
                      )}
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
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    {property.beds && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.beds} beds</span>
                      </div>
                    )}
                    {property.baths && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.baths} baths</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.sqft} {property.type === 'Land' ? '' : 'sqft'}</span>
                    </div>
                  </div>
                  
                  {property.emi && (
                    <div className="text-sm text-muted-foreground mb-3">
                      EMI from <span className="font-semibold text-primary">{property.emi}</span>
                    </div>
                  )}
                  
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
              Load More Properties
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Buy;