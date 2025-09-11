import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bed, Bath, Square, Heart, Eye, Filter, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import villageHouse from "@/assets/village-house.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import apartmentInterior from "@/assets/apartment-interior.jpg";

const rentProperties = [
  {
    id: 1,
    title: "2BHK Furnished Apartment",
    location: "Koramangala, Bangalore",
    rent: "₹35,000/month",
    deposit: "₹1,05,000",
    type: "Residential",
    image: apartmentInterior,
    beds: 2,
    baths: 2,
    sqft: "1,200",
    description: "Fully furnished apartment with modern amenities in prime Koramangala location.",
    featured: true,
    furnishing: "Fully Furnished",
    available: "Immediately",
    parking: "1 Covered",
    amenities: ["Gym", "Swimming Pool", "Security", "Power Backup"],
  },
  {
    id: 2,
    title: "Office Space for Rent",
    location: "Connaught Place, New Delhi",
    rent: "₹2,50,000/month",
    deposit: "₹10,00,000",
    type: "Commercial",
    image: commercialBuilding,
    beds: null,
    baths: 2,
    sqft: "3,000",
    description: "Premium office space in heart of Delhi with excellent connectivity.",
    featured: true,
    furnishing: "Unfurnished",
    available: "From 15th Feb",
    parking: "10 Car Spaces",
    amenities: ["CCTV", "Elevator", "Conference Room", "Cafeteria"],
  },
  {
    id: 3,
    title: "3BHK Independent House",
    location: "Sector 47, Gurgaon",
    rent: "₹45,000/month",
    deposit: "₹1,35,000",
    type: "Residential",
    image: villageHouse,
    beds: 3,
    baths: 3,
    sqft: "1,800",
    description: "Spacious independent house with garden and parking in peaceful locality.",
    featured: false,
    furnishing: "Semi Furnished",
    available: "From 1st March",
    parking: "2 Open",
    amenities: ["Garden", "Servant Quarter", "Power Backup", "Security"],
  },
];

const Rent = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rentRange, setRentRange] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(rentProperties);

  useEffect(() => {
    document.title = "Rent Properties in India - RealCox.com | Apartments, Houses, Office Spaces";
  }, []);

  const handleSearch = () => {
    let filtered = rentProperties;
    
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
              Rent Property in
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}India
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find perfect rental homes and office spaces across India. Verified properties, 
              transparent pricing, and zero brokerage options available.
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
                </SelectContent>
              </Select>
              <Select value={rentRange} onValueChange={setRentRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Rent Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-20k">Under ₹20,000</SelectItem>
                  <SelectItem value="20k-40k">₹20,000 - ₹40,000</SelectItem>
                  <SelectItem value="40k-60k">₹40,000 - ₹60,000</SelectItem>
                  <SelectItem value="60k-1l">₹60,000 - ₹1 Lakh</SelectItem>
                  <SelectItem value="1l-plus">₹1 Lakh+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button variant="hero" className="flex-1" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search Rentals
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
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
              {filteredProperties.length} Rental Properties
            </h2>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent-low">Rent: Low to High</SelectItem>
                <SelectItem value="rent-high">Rent: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="area">Area: Large to Small</SelectItem>
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
                      <Badge variant="secondary">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/90">
                      {property.furnishing}
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
                      <div className="text-lg font-bold">{property.rent}</div>
                      <div className="text-sm text-white/80">Deposit: {property.deposit}</div>
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
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Available: {property.available}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
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

export default Rent;