import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyRequirementsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    propertyType: "",
    location: "",
    budget: "",
    requirements: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, phone, and requirements.",
        variant: "destructive"
      });
      return;
    }

    // Create WhatsApp message
    const message = `🏠 *Property Requirement from RealCox Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🏢 *Property Type:* ${formData.propertyType || 'Not specified'}
📍 *Location:* ${formData.location || 'Not specified'}
💰 *Budget:* ${formData.budget || 'Not specified'}

📝 *Requirements:*
${formData.requirements}

Please contact me to discuss further.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919966215578?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
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
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Property Requirements
        </CardTitle>
        <p className="text-muted-foreground">
          Tell us your property requirements and we'll connect you with the best options via WhatsApp
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
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
              <Label htmlFor="phone">Phone Number *</Label>
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

            <div className="md:col-span-2">
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
            <Label htmlFor="requirements">Detailed Requirements *</Label>
            <Textarea
              id="requirements"
              placeholder="Describe your property requirements in detail (e.g., number of bedrooms, amenities, specific features, timeline, etc.)"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              rows={4}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Requirements via WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyRequirementsForm;