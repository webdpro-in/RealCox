import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Google authentication will be available once you connect your backend.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Sign in with Google
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google (Coming Soon)
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Or use phone login</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/phone-auth')}
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              Login with Phone Number
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuth;