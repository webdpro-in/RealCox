import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PhoneAuth = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'aadhaar'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [aadhaarName, setAadhaarName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feature Coming Soon",
      description: "Phone authentication will be available once you connect your backend.",
    });
  };

  const verifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feature Coming Soon",
      description: "OTP verification will be available once you connect your backend.",
    });
  };

  const verifyAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feature Coming Soon",
      description: "Aadhaar verification will be available once you connect your backend.",
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
            Secure Phone + Aadhaar Authentication
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {step === 'phone' && <Smartphone className="w-5 h-5" />}
              {step === 'otp' && <Shield className="w-5 h-5" />}
              {step === 'aadhaar' && <CheckCircle className="w-5 h-5" />}
              {step === 'phone' && "Enter Phone Number"}
              {step === 'otp' && "Verify OTP"}
              {step === 'aadhaar' && "Aadhaar Verification"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                Phone authentication will be available once you connect your backend.
              </AlertDescription>
            </Alert>

            {step === 'phone' && (
              <form onSubmit={sendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                      disabled
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled>
                  Send OTP (Coming Soon)
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneAuth;