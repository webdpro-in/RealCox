import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  Phone,
  Eye,
  Building2,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  status: string;
  price: number;
  area_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  state: string;
  images?: string[];
  is_featured: boolean;
  companies?: {
    company_name: string;
    rating: number;
  };
}

interface PropertyCardProps {
  property: Property;
  onContact?: (propertyId: string) => void;
  showCompanyInfo?: boolean;
}

const PropertyCard = ({ property, onContact, showCompanyInfo = true }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: "Apartment",
      villa: "Villa",
      house: "Independent House",
      plot: "Plot/Land",
      commercial: "Commercial Space",
      office: "Office Space"
    };
    return types[type] || type;
  };

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to contact property owners.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Contact functionality will be available once you connect your backend.",
    });

    onContact?.(property.id);
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save properties.",
        variant: "destructive"
      });
      return;
    }
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Wishlist" : "Added to Wishlist",
      description: isLiked ? "Property removed from your wishlist" : "Property saved to your wishlist",
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/property/${property.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Property link has been copied to clipboard.",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Building2 className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.is_featured && (
              <Badge className="bg-yellow-500 text-white">Featured</Badge>
            )}
            <Badge variant="secondary">{property.status}</Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Property Type */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-white/90">
              {getPropertyTypeLabel(property.property_type)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </h3>
            {showCompanyInfo && property.companies && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{property.companies.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold mb-2 line-clamp-1">{property.title}</h4>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{property.address}, {property.city}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>

          {/* Company Info */}
          {showCompanyInfo && property.companies && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{property.companies.company_name}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              className="w-full"
              onClick={handleContact}
              disabled={isLoading}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PropertyCard;