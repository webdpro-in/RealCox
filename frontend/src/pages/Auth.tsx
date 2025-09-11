import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Building2, User, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Authentication will be available once you connect your backend.",
    });
  };

  const handleSignup = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "User registration will be available once you connect your backend.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              RealCox
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            India's Leading Real Estate Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {activeTab === "login" ? "Welcome Back" : "Join RealCox"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <Alert className="mt-4">
                <AlertDescription>
                  Authentication features will be available once you connect your backend.
                </AlertDescription>
              </Alert>

              <TabsContent value="login">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      disabled
                    />
                  </div>
                  <Button onClick={handleLogin} className="w-full" variant="hero">
                    Sign In (Coming Soon)
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  <Button onClick={handleSignup} className="w-full" variant="hero">
                    Create Account (Coming Soon)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;