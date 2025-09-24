import { Button } from "@/components/ui/button";
import PropertyRequirementsForm from "@/components/PropertyRequirementsForm";
import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Globe } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury property with mountain view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Property Requirements Form (Appears first on mobile) */}
          <div className="order-1 lg:order-1">
            <Card className="border-primary/20 bg-white/95 backdrop-blur-sm shadow-premium p-6">
              <PropertyRequirementsForm />
            </Card>
          </div>

          {/* Right Side - Hero Content (Appears second on mobile) */}
          <div className="order-2 lg:order-2">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Property Journey
              <span className="bg-gradient-to-r from-secondary to-luxury bg-clip-text text-transparent block">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Tell us your property requirements and let our expert team find the perfect match for you. From residential to commercial properties - we handle everything.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Local & National Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Globe className="w-5 h-5 text-secondary" />
                <span>Professional Service</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="premium" size="lg">
                Submit Requirements
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;