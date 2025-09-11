import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, MapPin, TrendingUp, Users, CheckCircle, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sellServices = [
  {
    title: "Free Property Valuation",
    description: "Get accurate market valuation of your property by certified valuers",
    icon: TrendingUp,
    features: ["Market Analysis", "Comparable Sales", "Expert Opinion", "Detailed Report"]
  },
  {
    title: "Professional Photography",
    description: "High-quality photos and virtual tours to showcase your property",
    icon: Camera,
    features: ["HD Photography", "Virtual Tours", "Drone Shots", "360° Views"]
  },
  {
    title: "Expert Marketing",
    description: "Multi-channel marketing to reach maximum potential buyers",
    icon: Users,
    features: ["Online Listings", "Social Media", "Print Ads", "Network Marketing"]
  },
];

const sellingSteps = [
  {
    step: 1,
    title: "List Your Property",
    description: "Fill out the simple form with your property details"
  },
  {
    step: 2,
    title: "Professional Valuation",
    description: "Our experts will visit and provide accurate market valuation"
  },
  {
    step: 3,
    title: "Marketing & Promotion",
    description: "We market your property across multiple channels"
  },
  {
    step: 4,
    title: "Buyer Verification",
    description: "We screen and verify all potential buyers for you"
  },
  {
    step: 5,
    title: "Documentation & Sale",
    description: "Complete legal documentation and sale process"
  },
];

const Sell = () => {
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    expectedPrice: "",
    description: "",
    ownerName: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    document.title = "Sell Your Property in India - RealCox.com | Free Valuation & Expert Marketing";
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
    alert("Thank you! We'll contact you within 24 hours for property valuation.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sell Your Property with
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}Confidence
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get the best price for your property with our expert guidance, professional marketing, 
              and verified buyer network across India.
            </p>
          </div>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Zero Commission</h3>
              <p className="text-sm text-muted-foreground">No hidden fees or commission charges</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Market Price</h3>
              <p className="text-sm text-muted-foreground">Expert valuation for maximum returns</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Verified Buyers</h3>
              <p className="text-sm text-muted-foreground">Pre-screened and genuine buyers only</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Legal Support</h3>
              <p className="text-sm text-muted-foreground">Complete documentation assistance</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Listing Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">List Your Property</h2>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Property Type</label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Independent Villa</SelectItem>
                            <SelectItem value="house">Independent House</SelectItem>
                            <SelectItem value="plot">Plot/Land</SelectItem>
                            <SelectItem value="commercial">Commercial Space</SelectItem>
                            <SelectItem value="office">Office Space</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">City/Location</label>
                        <Input 
                          placeholder="Enter city and locality"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Total Area (sqft)</label>
                        <Input 
                          placeholder="e.g. 1200"
                          value={formData.area}
                          onChange={(e) => handleInputChange("area", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Bedrooms</label>
                        <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 BHK</SelectItem>
                            <SelectItem value="2">2 BHK</SelectItem>
                            <SelectItem value="3">3 BHK</SelectItem>
                            <SelectItem value="4">4 BHK</SelectItem>
                            <SelectItem value="5">5+ BHK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Bathrooms</label>
                        <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Expected Price (₹)</label>
                      <Input 
                        placeholder="e.g. 50,00,000"
                        value={formData.expectedPrice}
                        onChange={(e) => handleInputChange("expectedPrice", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Description</label>
                      <Textarea 
                        placeholder="Describe your property features, amenities, nearby landmarks..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <Input 
                          placeholder="Enter your name"
                          value={formData.ownerName}
                          onChange={(e) => handleInputChange("ownerName", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input 
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input 
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Photos</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Drag & drop photos or click to browse</p>
                        <Button variant="outline">Choose Files</Button>
                      </div>
                    </div>
                    
                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      List My Property
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Services & Process */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Services</h2>
                <div className="space-y-6">
                  {sellServices.map((service, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <service.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">{service.title}</h3>
                            <p className="text-muted-foreground mb-3">{service.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {service.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                <div className="space-y-4">
                  {sellingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Need Help Selling Your Property?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our property experts are here to guide you through every step
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Call +91 9876543210
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Sell;