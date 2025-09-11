import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react";
import villageHouse from "@/assets/village-house.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import landProperty from "@/assets/land-property.jpg";
import apartmentInterior from "@/assets/apartment-interior.jpg";

const properties = [
  {
    id: 1,
    title: "Charming Village Cottage",
    location: "Cotswolds, England",
    price: "$485,000",
    type: "Residential",
    scale: "Village",
    image: villageHouse,
    beds: 3,
    baths: 2,
    sqft: "1,850",
    description: "Beautiful thatched cottage with stunning countryside views and traditional charm.",
    featured: true,
  },
  {
    id: 2,
    title: "Modern Corporate Headquarters",
    location: "Manhattan, New York",
    price: "$12,500,000",
    type: "Commercial",
    scale: "International",
    image: commercialBuilding,
    beds: null,
    baths: null,
    sqft: "45,000",
    description: "State-of-the-art office building in prime Manhattan location.",
    featured: true,
  },
  {
    id: 3,
    title: "Prime Agricultural Land",
    location: "Tuscany, Italy",
    price: "$2,200,000",
    type: "Land",
    scale: "International",
    image: landProperty,
    beds: null,
    baths: null,
    sqft: "500 acres",
    description: "Fertile agricultural land with vineyard potential and stunning mountain views.",
    featured: false,
  },
  {
    id: 4,
    title: "Luxury Penthouse Suite",
    location: "Dubai Marina, UAE",
    price: "$3,750,000",
    type: "Residential",
    scale: "International",
    image: apartmentInterior,
    beds: 4,
    baths: 5,
    sqft: "4,200",
    description: "Ultra-luxury penthouse with panoramic city and ocean views.",
    featured: true,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured 
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {" "}Properties
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our handpicked selection of exceptional properties from cozy village homes to international luxury developments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="group overflow-hidden hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.featured && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-semibold">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/90 text-foreground">
                    {property.scale}
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
                  <Badge className="bg-primary text-primary-foreground text-lg font-bold px-3 py-1">
                    {property.price}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm">
                  {property.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
                
                <div className="flex gap-2">
                  <Button variant="hero" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Contact Agent
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="premium" size="lg">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;