import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Send } from "lucide-react";

interface PropertyContactCardProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

const PropertyContactCard = ({ propertyId, propertyTitle, onSuccess }: PropertyContactCardProps) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to contact property owners.",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      toast({
        title: "Feature Coming Soon",
        description: "Contact functionality will be available once you connect your backend.",
      });

      // Reset form
      setMessage("");
      setPhone("");
      onSuccess?.();

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Contact Property Owner</h3>
          <p className="text-muted-foreground mb-4">
            Please login to contact the property owner
          </p>
          <Button onClick={() => window.location.href = "/auth"}>
            Login to Contact
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Contact Owner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Send a message about "{propertyTitle}"
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Your Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in this property. Please contact me."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyContactCard;