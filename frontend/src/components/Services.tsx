import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Camera, BarChart3, FileText, Handshake, Headphones } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Global Property Search",
    description: "Advanced AI-powered search across 120+ countries with filters for every property type and scale.",
    features: ["Multi-language support", "Real-time availability", "Virtual tours", "Saved searches & alerts"],
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Camera,
    title: "Virtual Property Tours",
    description: "360° virtual tours, drone footage, and AR visualization for properties worldwide.",
    features: ["360° photography", "Drone footage", "AR overlays", "3D floor plans"],
    gradient: "from-secondary to-luxury"
  },
  {
    icon: BarChart3,
    title: "Market Analytics",
    description: "Comprehensive market insights, trend analysis, and investment forecasting tools.",
    features: ["Price trends", "ROI calculators", "Market reports", "Investment analysis"],
    gradient: "from-accent to-earth"
  },
  {
    icon: FileText,
    title: "Legal & Documentation",
    description: "Complete legal support for international transactions with document management.",
    features: ["Legal compliance", "Document verification", "Contract templates", "Regulatory guidance"],
    gradient: "from-luxury to-secondary"
  },
  {
    icon: Handshake,
    title: "Transaction Management",
    description: "Secure escrow services, multi-currency payments, and complete transaction oversight.",
    features: ["Escrow services", "Multi-currency support", "Payment processing", "Progress tracking"],
    gradient: "from-earth to-accent"
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "24/7 multilingual support from certified real estate professionals worldwide.",
    features: ["24/7 availability", "Multilingual support", "Expert consultation", "Local market knowledge"],
    gradient: "from-primary to-secondary"
  }
];

const Services = () => {
  console.log("Services component is rendering...");
  
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our 
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {" "}Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive real estate services designed to make your property journey seamless, from search to settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-premium transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're buying your first home or expanding your global portfolio, our team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Start Your Property Search
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;