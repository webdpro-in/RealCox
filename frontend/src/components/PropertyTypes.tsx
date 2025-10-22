import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, TreePine, Factory, Crown, Globe } from "lucide-react";

const propertyTypes = [
  {
    icon: Home,
    title: "Residential Properties",
    description: "From village cottages to luxury penthouses, find your perfect home anywhere in the world.",
    features: ["Village Houses", "City Apartments", "Luxury Villas", "Condominiums"],
    gradient: "from-accent to-earth",
    count: "25,000+"
  },
  {
    icon: Building2,
    title: "Commercial Real Estate",
    description: "Office buildings, retail spaces, and business centers for small enterprises to multinational corporations.",
    features: ["Office Buildings", "Retail Spaces", "Shopping Centers", "Business Parks"],
    gradient: "from-primary to-primary-glow",
    count: "12,500+"
  },
  {
    icon: TreePine,
    title: "Land & Agricultural",
    description: "Investment opportunities in agricultural land, development plots, and natural reserves worldwide.",
    features: ["Agricultural Land", "Development Plots", "Forest Land", "Recreational Land"],
    gradient: "from-accent to-earth",
    count: "8,200+"
  },
  {
    icon: Factory,
    title: "Industrial Properties",
    description: "Manufacturing facilities, warehouses, and logistics centers for industrial operations.",
    features: ["Warehouses", "Manufacturing Plants", "Logistics Centers", "Industrial Parks"],
    gradient: "from-muted-foreground to-foreground",
    count: "3,800+"
  },
  {
    icon: Crown,
    title: "Luxury & Premium",
    description: "Exclusive high-end properties including mansions, estates, and luxury developments.",
    features: ["Luxury Estates", "Private Islands", "Historic Properties", "Ultra-Luxury Condos"],
    gradient: "from-secondary to-luxury",
    count: "1,500+"
  },
  {
    icon: Globe,
    title: "International Properties",
    description: "Cross-border real estate opportunities for global investors and international buyers.",
    features: ["Overseas Investments", "Vacation Homes", "International Commercial", "Global Portfolios"],
    gradient: "from-primary to-luxury",
    count: "15,000+"
  }
];

const PropertyTypes = () => {
  console.log("PropertyTypes component is rendering...");
  
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Property 
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {" "}Categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive range of property types, from local village homes to international commercial developments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card key={index} className="group hover:shadow-premium transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${type.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {type.title}
                    </h3>
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {type.count}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {type.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Browse {type.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our global network covers properties of all types and scales. Let our experts help you find the perfect property match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Contact Our Experts
              </Button>
              <Button variant="outline" size="lg">
                Custom Property Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;