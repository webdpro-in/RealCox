import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Globe, TrendingUp, Shield, Award } from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About 
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}RealCox
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              RealCox.com is your trusted real estate partner, connecting buyers, sellers, and investors with the perfect property solutions. We specialize in matching your requirements with the right properties.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Professional Service</h4>
                  <p className="text-muted-foreground">Dedicated support throughout your property journey with expert guidance and transparent processes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Tailored Solutions</h4>
                  <p className="text-muted-foreground">From residential homes to commercial properties, we find solutions that match your specific needs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Direct Communication</h4>
                  <p className="text-muted-foreground">Connect directly with our team through WhatsApp for quick responses and personalized assistance.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                Learn More About Us
              </Button>
              <Button variant="outline" size="lg">
                Meet Our Team
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={teamPhoto} 
              alt="RealCox professional team" 
              className="w-full rounded-2xl shadow-premium"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-elegant">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2025</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="group hover:shadow-premium transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Our Mission</h3>
              <p className="text-muted-foreground">
                To simplify real estate transactions by connecting the right properties with the right people through personalized service and expert guidance.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-premium transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-luxury rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Our Values</h3>
              <p className="text-muted-foreground">
                Transparency, security, and integrity in every transaction. We believe in building trust through honest dealings and cutting-edge technology.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-premium transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-earth rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Our Vision</h3>
              <p className="text-muted-foreground">
                To become a trusted real estate partner by providing exceptional service, building lasting relationships, and helping clients achieve their property goals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose RealCox */}
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}RealCox?
              </span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're your dedicated real estate partner, committed to finding the perfect property solution for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Local Expertise</h4>
                <p className="text-muted-foreground text-sm">Deep understanding of local markets with personalized service for every client.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Trusted Process</h4>
                <p className="text-muted-foreground text-sm">Transparent and secure property transactions with professional legal support.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Market Knowledge</h4>
                <p className="text-muted-foreground text-sm">Up-to-date market insights and property analysis for informed decision making.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-luxury rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Professional Service</h4>
                <p className="text-muted-foreground text-sm">Dedicated support from experienced real estate professionals throughout your journey.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-earth rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Client Focus</h4>
                <p className="text-muted-foreground text-sm">Building lasting relationships by putting our clients' needs and satisfaction first.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Commitment to Excellence</h4>
                <p className="text-muted-foreground text-sm">Fresh approach to real estate with commitment to quality service and client satisfaction.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;