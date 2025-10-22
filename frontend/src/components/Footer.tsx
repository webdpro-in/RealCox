import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  console.log("Footer component is rendering...");

  const handleAdminLogin = () => {
    navigate('/admin');
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-secondary to-luxury bg-clip-text text-transparent">
                  RealCox
                </h3>
                <span className="ml-2 text-background/70">.com</span>
              </div>
              <p className="text-background/80 mb-6 leading-relaxed">
                Your trusted partner in real estate. Connecting buyers, sellers, and companies with the perfect property solutions since 2025.
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="secondary" className="w-10 h-10">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="w-10 h-10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="w-10 h-10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="w-10 h-10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-background">Quick Links</h4>
              <div className="space-y-3">
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Buy Properties</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Rent Properties</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Sell Properties</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Commercial Real Estate</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Land & Agricultural</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Luxury Properties</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">International Properties</a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-background">Services</h4>
              <div className="space-y-3">
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Property Search</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Virtual Tours</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Market Analytics</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Legal Support</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Transaction Management</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Investment Consultation</a>
                <a href="#" className="block text-background/80 hover:text-secondary transition-colors">Property Valuation</a>
              </div>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-background">Stay Connected</h4>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-background/80">
                  <Phone className="w-5 h-5 text-secondary" />
                  <a 
                    href="https://wa.me/919966215578?text=Hi%20RealCox,%20I%20would%20like%20to%20connect%20with%20you.%20Please%20contact%20me."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors cursor-pointer"
                  >
                    +91 99662 15578
                  </a>
                </div>
                <div className="flex items-center gap-3 text-background/80">
                  <Mail className="w-5 h-5 text-secondary" />
                  <span>info@realcox.com</span>
                </div>
                <div className="flex items-center gap-3 text-background/80">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span>India</span>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-3 text-background">Newsletter</h5>
                <p className="text-sm text-background/70 mb-4">Get the latest property updates and market insights.</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                  />
                  <Button variant="secondary" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-background/70 text-sm">
              © 2025 RealCox.com. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">Terms of Service</a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">Cookie Policy</a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">Sitemap</a>
            </div>
          </div>
          
          {/* Admin Login */}
          <div className="mt-4 text-center">
            <button
              onClick={handleAdminLogin}
              className="inline-flex items-center gap-2 text-xs text-background/50 hover:text-blue-400 transition-colors group cursor-pointer"
            >
              <Shield className="w-3 h-3 group-hover:text-blue-400" />
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;