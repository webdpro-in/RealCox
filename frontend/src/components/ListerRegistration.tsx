import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Building2, UserCheck, Percent, Loader2 } from "lucide-react";

const ListerRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Individual Affiliate Form
  const [affiliateData, setAffiliateData] = useState({
    fullName: "",
    phone: "",
    email: "",
    commissionRate: "1.00"
  });

  // Company Form
  const [companyData, setCompanyData] = useState({
    companyName: "",
    description: "",
    website: "",
    reraNumber: "",
    licenseNumber: "",
    establishedYear: "",
    commissionRate: "3.00"
  });

  const registerAsAffiliate = async () => {
    if (!isAuthenticated) {
      setError("Please log in to register as an affiliate");
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Lister registration will be available once you connect your backend.",
    });
  };

  const registerAsCompany = async () => {
    if (!isAuthenticated) {
      setError("Please log in to register your company");
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Company registration will be available once you connect your backend.",
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Become a Lister</h3>
          <p className="text-muted-foreground mb-4">
            Join our platform as an Individual Affiliate or Company Lister
          </p>
          <Button onClick={() => window.location.href = "/auth"}>
            Login to Register
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Become a Lister
          </CardTitle>
          <p className="text-muted-foreground">
            Choose your lister type and start earning commissions from property deals
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Individual Affiliate
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Lister
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Affiliate Lister</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                Transparent Commission:
                <Badge variant="secondary">1% from total deal value</Badge>
              </div>
              <Alert>
                <AlertDescription>
                  Feature coming soon - Connect your backend to enable registrations.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full-name">Full Name *</Label>
                  <Input
                    id="full-name"
                    value={affiliateData.fullName}
                    onChange={(e) => setAffiliateData({...affiliateData, fullName: e.target.value})}
                    placeholder="Enter your full name"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={affiliateData.phone}
                    onChange={(e) => setAffiliateData({...affiliateData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    disabled
                  />
                </div>
              </div>

      <Button 
        onClick={registerAsAffiliate} 
        disabled 
        className="w-full"
      >
        Register as Individual Affiliate (Coming Soon)
      </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Lister</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                Transparent Commission:
                <Badge variant="secondary">Buyer: 2.5% • Seller: 1.5% • Platform: 0.5%</Badge>
              </div>
              <Alert>
                <AlertDescription>
                  Feature coming soon - Connect your backend to enable company registrations.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                    placeholder="Enter company name"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                    placeholder="https://yourcompany.com"
                    disabled
                  />
                </div>
              </div>

              <Button 
                onClick={registerAsCompany} 
                disabled 
                className="w-full"
              >
                Register Company (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListerRegistration;