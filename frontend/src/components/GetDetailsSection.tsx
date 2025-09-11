import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, MapPin, Search, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const GetDetailsSection = () => {
  const [searchData, setSearchData] = useState({
    state: "",
    district: "",
    surveyNumber: ""
  });
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const fetchLandDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to fetch your property details.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Property details fetching will be available once you connect your backend.",
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 text-center">
          <Database className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Get Your Property Details</h3>
          <p className="text-muted-foreground mb-4">
            Automatically fetch your registered land and property details from government records
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/auth"}>
            Login to Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Get Your Property Details
        </CardTitle>
        <p className="text-muted-foreground">
          Feature coming soon - Connect your backend to fetch government land records
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={fetchLandDetails} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="state">State *</Label>
              <Select 
                value={searchData.state} 
                onValueChange={(value) => setSearchData({...searchData, state: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="district">District (Optional)</Label>
              <Input
                id="district"
                type="text"
                placeholder="Enter district name"
                value={searchData.district}
                onChange={(e) => setSearchData({...searchData, district: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="survey">Survey Number (Optional)</Label>
              <Input
                id="survey"
                type="text"
                placeholder="Enter survey number"
                value={searchData.surveyNumber}
                onChange={(e) => setSearchData({...searchData, surveyNumber: e.target.value})}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={!searchData.state}
          >
            <Search className="w-4 h-4 mr-2" />
            Get Property Details (Coming Soon)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GetDetailsSection;