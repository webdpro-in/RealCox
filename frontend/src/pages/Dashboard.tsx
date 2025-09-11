import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin, 
  Home,
  IndianRupee,
  User,
  Settings,
  Plus,
  BarChart3,
  Handshake
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    document.title = "Dashboard - RealCox.com | Manage Your Real Estate Business";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'company': return <Building2 className="w-5 h-5" />;
      case 'buyer': return <User className="w-5 h-5" />;
      case 'seller': return <TrendingUp className="w-5 h-5" />;
      case 'affiliate': return <Users className="w-5 h-5" />;
      case 'admin': return <Settings className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'company': return 'Real Estate Company';
      case 'buyer': return 'Property Buyer';
      case 'seller': return 'Property Seller';
      case 'affiliate': return 'Affiliate Partner';
      case 'admin': return 'Platform Admin';
      default: return 'User';
    }
  };

  const getQuickActions = () => {
    switch (profile.role) {
      case 'company':
        return [
          { label: "Add Property", icon: Plus, href: "/company/properties/new", color: "bg-green-500" },
          { label: "View Leads", icon: Users, href: "/company/leads", color: "bg-blue-500" },
          { label: "Analytics", icon: BarChart3, href: "/company/analytics", color: "bg-purple-500" },
          { label: "Company Profile", icon: Building2, href: "/company/profile", color: "bg-orange-500" }
        ];
      case 'buyer':
        return [
          { label: "Search Properties", icon: Home, href: "/buy", color: "bg-blue-500" },
          { label: "My Inquiries", icon: Mail, href: "/buyer/inquiries", color: "bg-green-500" },
          { label: "Saved Properties", icon: TrendingUp, href: "/buyer/saved", color: "bg-purple-500" },
          { label: "Profile Settings", icon: User, href: "/buyer/profile", color: "bg-orange-500" }
        ];
      case 'seller':
        return [
          { label: "List Property", icon: Plus, href: "/sell", color: "bg-green-500" },
          { label: "My Listings", icon: Home, href: "/seller/properties", color: "bg-blue-500" },
          { label: "Property Inquiries", icon: Users, href: "/seller/inquiries", color: "bg-purple-500" },
          { label: "Profile Settings", icon: User, href: "/seller/profile", color: "bg-orange-500" }
        ];
      case 'affiliate':
        return [
          { label: "Generate Links", icon: Plus, href: "/affiliate/links", color: "bg-green-500" },
          { label: "Track Earnings", icon: IndianRupee, href: "/affiliate/earnings", color: "bg-blue-500" },
          { label: "Marketing Tools", icon: BarChart3, href: "/affiliate/tools", color: "bg-purple-500" },
          { label: "Profile Settings", icon: User, href: "/affiliate/profile", color: "bg-orange-500" }
        ];
      default:
        return [];
    }
  };

  const getStats = () => {
    // Mock stats - in real app, fetch from API
    switch (profile.role) {
      case 'company':
        return [
          { label: "Total Properties", value: "12", icon: Home },
          { label: "Active Leads", value: "8", icon: Users },
          { label: "This Month Deals", value: "3", icon: Handshake },
          { label: "Total Revenue", value: "₹2.4L", icon: IndianRupee }
        ];
      case 'buyer':
        return [
          { label: "Properties Viewed", value: "15", icon: Home },
          { label: "Inquiries Sent", value: "6", icon: Mail },
          { label: "Saved Properties", value: "9", icon: TrendingUp },
          { label: "Shortlisted", value: "3", icon: Users }
        ];
      case 'seller':
        return [
          { label: "Properties Listed", value: "4", icon: Home },
          { label: "Total Views", value: "142", icon: Users },
          { label: "Inquiries Received", value: "12", icon: Mail },
          { label: "Offers Received", value: "2", icon: Handshake }
        ];
      case 'affiliate':
        return [
          { label: "Total Clicks", value: "324", icon: TrendingUp },
          { label: "Conversions", value: "8", icon: Users },
          { label: "Total Earnings", value: "₹18,500", icon: IndianRupee },
          { label: "This Month", value: "₹5,200", icon: Handshake }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile.full_name}!
              </h1>
              <div className="flex items-center gap-2 mt-2">
                {getRoleIcon(profile.role)}
                <span className="text-muted-foreground">{getRoleLabel(profile.role)}</span>
                {profile.is_verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStats().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getQuickActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => navigate(action.href)}
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.full_name}</p>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {profile.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{profile.address}</p>
                      {profile.city && profile.state && (
                        <p className="text-sm text-muted-foreground">
                          {profile.city}, {profile.state} {profile.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Badge variant={profile.is_verified ? "default" : "secondary"}>
                    {profile.is_verified ? "Verified Account" : "Pending Verification"}
                  </Badge>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;