import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Phone, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();

  console.log("Header component is rendering...");

  return (
    <header className="bg-background shadow-elegant sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <a 
                  href="https://wa.me/919966215578?text=Hi%20RealCox,%20I%20would%20like%20to%20connect%20with%20you.%20Please%20contact%20me."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  +91 99662 15578
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@realcox.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-muted-foreground">
              <span>Global Real Estate Solutions</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Worldwide Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              RealCox
            </h1>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:block">.com</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/buy" className="text-foreground hover:text-primary transition-colors">Buy</Link>
            <Link to="/rent" className="text-foreground hover:text-primary transition-colors">Rent</Link>
            <Link to="/sell" className="text-foreground hover:text-primary transition-colors">Sell</Link>
            <Link to="/commercial" className="text-foreground hover:text-primary transition-colors">Commercial</Link>
            <Link to="/land" className="text-foreground hover:text-primary transition-colors">Land</Link>
            <a href="/#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <Link to="/agents" className="text-foreground hover:text-primary transition-colors">Agents</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 mr-2" />
                  {profile?.full_name || 'Dashboard'}
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="hero" size="sm" onClick={() => navigate('/sell')}>
                  List Property
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/buy" className="text-foreground hover:text-primary transition-colors">Buy</Link>
              <Link to="/rent" className="text-foreground hover:text-primary transition-colors">Rent</Link>
              <Link to="/sell" className="text-foreground hover:text-primary transition-colors">Sell</Link>
              <Link to="/commercial" className="text-foreground hover:text-primary transition-colors">Commercial</Link>
              <Link to="/land" className="text-foreground hover:text-primary transition-colors">Land</Link>
              <Link to="/companies" className="text-foreground hover:text-primary transition-colors">Companies</Link>
              <Link to="/agents" className="text-foreground hover:text-primary transition-colors">Agents</Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="hero" size="sm" onClick={() => navigate('/sell')}>
                      List Property
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;