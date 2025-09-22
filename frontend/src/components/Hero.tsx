import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, TrendingUp, Globe, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { submitRequirement } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-property.jpg";

const Hero = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    location: "",
    budget: "",
    requirements: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and phone number.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Store in MongoDB via our backend
      const response = await submitRequirement({
        name: formData.name,
        email: formData.email || 'not-provided@example.com',
        phone: formData.phone,
        propertyType: formData.propertyType || 'residential',
        listingType: 'buy',
        budget: { min: 0, max: 10000000 },
        location: formData.location || 'Not specified',
        message: formData.requirements || 'No specific requirements provided'
      });

      if (!response.success) {
        throw new Error('Failed to store requirement');
      }
    } catch (error) {
      console.error('Failed to store requirement:', error);
    }

    // Create WhatsApp message
    const message = `🏠 *Property Requirement from RealCox Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🏢 *Property Type:* ${formData.propertyType || 'Not specified'}
📍 *Location:* ${formData.location || 'Not specified'}
💰 *Budget:* ${formData.budget || 'Not specified'}

📝 *Requirements:*
${formData.requirements || 'No specific requirements provided'}

Please contact me to discuss further.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919966215578?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      propertyType: "",
      location: "",
      budget: "",
      requirements: ""
    });

    toast({
      title: "Requirements Sent!",
      description: "Your property requirements have been sent via WhatsApp. We'll contact you soon.",
    });
  };

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury property with mountain view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Property Requirements Form (Appears first on mobile) */}
          <div className="order-1 lg:order-1">
            <Card className="border-primary/20 bg-white/95 backdrop-blur-sm shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="w-5 h-5" />
                  Property Requirements
                </CardTitle>
                <p className="text-muted-foreground">
                  Tell us your property requirements and we'll connect you with the best options via WhatsApp
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center">
                        Full Name 
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center">
                        Phone Number 
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select 
                        value={formData.propertyType} 
                        onValueChange={(value) => setFormData({...formData, propertyType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Land/Plot</SelectItem>
                          <SelectItem value="agricultural">Agricultural Land</SelectItem>
                          <SelectItem value="villa">Villa/Independent House</SelectItem>
                          <SelectItem value="apartment">Apartment/Flat</SelectItem>
                          <SelectItem value="office">Office Space</SelectItem>
                          <SelectItem value="retail">Retail Shop</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Preferred Location</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Enter city, area, or locality"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Input
                        id="budget"
                        type="text"
                        placeholder="e.g., ₹50 Lakhs - ₹1 Crore"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Detailed Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe your property requirements in detail (e.g., number of bedrooms, amenities, specific features, timeline, etc.)"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Requirements via WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Hero Content (Appears second on mobile) */}
          <div className="order-2 lg:order-2">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Property Journey
              <span className="bg-gradient-to-r from-secondary to-luxury bg-clip-text text-transparent block">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Tell us your property requirements and let our expert team find the perfect match for you. From residential to commercial properties - we handle everything.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Local & National Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Globe className="w-5 h-5 text-secondary" />
                <span>Professional Service</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="premium" size="lg">
                Submit Requirements
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;