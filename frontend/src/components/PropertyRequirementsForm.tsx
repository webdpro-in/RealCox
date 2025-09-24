import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Home, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyRequirementsForm = () => {
  const [listingType, setListingType] = useState<'buy' | 'sell'>('buy');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
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
      // Prepare data for Google Sheets
      const sheetData = {
        timestamp: new Date().toISOString(),
        listingType,
        name: formData.name,
        phone: formData.phone,
        propertyType: formData.propertyType || 'Not specified',
        location: formData.location || 'Not specified',
        budget: formData.budget || 'Not specified',
        requirements: formData.requirements
      };

      // Send to Google Sheets (using a proxy or backend endpoint)
      // In a real implementation, you would send this to your backend
      // which would then handle the Google Sheets integration
      console.log("Sending to Google Sheets:", sheetData);

      // Create WhatsApp message
      const message = `🏠 *Property ${listingType === 'buy' ? 'Requirement' : 'Listing'} from RealCox Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🏢 *Property Type:* ${formData.propertyType || 'Not specified'}
📍 *Location:* ${formData.location || 'Not specified'}
💰 *${listingType === 'buy' ? 'Budget' : 'Expected Price'}:* ${formData.budget || 'Not specified'}

${listingType === 'buy' ? '📝 *Requirements:*' : '📝 *Property Details:*'}
${formData.requirements || 'Not provided'}

Please contact me to discuss further.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919966215578?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      // Also send to backend for storage in MongoDB
      try {
        const response = await fetch('/api/requirements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: 'not-provided@example.com',
            phone: formData.phone,
            propertyType: formData.propertyType || 'residential',
            listingType: listingType,
            budget: { min: 0, max: 10000000 },
            location: formData.location || 'Not specified',
            message: formData.requirements || 'Not provided'
          }),
        });
        
        const result = await response.json();
        if (!result.success) {
          console.error('Failed to store requirement in database');
        }
      } catch (dbError) {
        console.error('Database storage error:', dbError);
      }
      
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
        title: "Success!",
        description: `Your property ${listingType === 'buy' ? 'requirements' : 'listing'} have been sent via WhatsApp and recorded.`,
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <MessageSquare className="w-5 h-5" />
          Property {listingType === 'buy' ? 'Requirements' : 'Listing'}
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          {listingType === 'buy' 
            ? '' 
            : ''}
        </p>
      </CardHeader>
      <CardContent>
        {/* Buy/Sell Toggle */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setListingType('buy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all text-sm sm:text-base ${
              listingType === 'buy'
                ? 'bg-primary text-primary-foreground shadow'
                : 'hover:bg-muted-foreground/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Buy</span>
          </button>
          <button
            type="button"
            onClick={() => setListingType('sell')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all text-sm sm:text-base ${
              listingType === 'sell'
                ? 'bg-primary text-primary-foreground shadow'
                : 'hover:bg-muted-foreground/10'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Sell</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="py-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="py-5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-medium">
                Property Type
              </Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(value) => setFormData({...formData, propertyType: value})}
              >
                <SelectTrigger className="py-5">
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

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Preferred Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter city, area, or locality"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="py-5"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">
                {listingType === 'buy' ? 'Budget Range' : 'Expected Price'}
              </Label>
              <Input
                id="budget"
                type="text"
                placeholder={listingType === 'buy' ? "e.g., ₹50 Lakhs - ₹1 Crore" : "e.g., ₹1.5 Crore"}
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="py-5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium">
              {listingType === 'buy' ? 'Detailed Requirements' : 'Property Details'}
            </Label>
            <Textarea
              id="requirements"
              placeholder={
                listingType === 'buy' 
                  ? "Describe your property requirements in detail (e.g., number of bedrooms, amenities, specific features, timeline, etc.)" 
                  : "Describe your property details (e.g., size, features, condition, availability, etc.)"
              }
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              rows={4}
              className="py-3 min-h-[120px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto py-5 text-base"
          >
            <Send className="w-4 h-4 mr-2" />
            Send 
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyRequirementsForm;