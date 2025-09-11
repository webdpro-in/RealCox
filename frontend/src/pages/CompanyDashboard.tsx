import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CompanyDashboard = () => {
  const { toast } = useToast();

  const handleFeature = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Company dashboard will be available once you connect your backend.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="w-8 h-8" />
              Company Dashboard
            </h1>
            <Button onClick={handleFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property (Coming Soon)
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Company dashboard features will be available once you connect your backend:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Manage company properties</li>
                <li>View leads and inquiries</li>
                <li>Analytics and reports</li>
                <li>Property performance tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyDashboard;