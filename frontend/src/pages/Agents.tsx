import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Award, Users, Building, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import teamPhoto from "@/assets/team-photo.jpg";

const topAgents = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "Senior Property Consultant",
    location: "Mumbai, Maharashtra",
    image: teamPhoto,
    rating: 4.9,
    reviews: 156,
    experience: "8 years",
    specialization: ["Luxury Homes", "Commercial Properties"],
    propertiesSold: 245,
    languages: ["Hindi", "English", "Marathi"],
    description: "Expert in luxury residential and commercial properties across Mumbai with proven track record.",
    badge: "Top Performer",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    title: "Real Estate Advisor",
    location: "Bangalore, Karnataka",
    image: teamPhoto,
    rating: 4.8,
    reviews: 132,
    experience: "6 years",
    specialization: ["Tech Hub Properties", "Investment Advisory"],
    propertiesSold: 189,
    languages: ["Hindi", "English", "Kannada"],
    description: "Specialist in tech corridor properties and investment guidance for IT professionals.",
    badge: "Investment Expert",
  },
  {
    id: 3,
    name: "Anita Patel",
    title: "Property Manager",
    location: "Ahmedabad, Gujarat",
    image: teamPhoto,
    rating: 4.7,
    reviews: 98,
    experience: "5 years",
    specialization: ["Residential", "First-time Buyers"],
    propertiesSold: 156,
    languages: ["Hindi", "English", "Gujarati"],
    description: "Dedicated to helping first-time buyers find their perfect home with personalized service.",
    badge: "Rising Star",
  },
  {
    id: 4,
    name: "Vikram Singh",
    title: "Commercial Specialist",
    location: "Gurgaon, Haryana",
    image: teamPhoto,
    rating: 4.9,
    reviews: 203,
    experience: "10 years",
    specialization: ["Office Spaces", "Retail Properties"],
    propertiesSold: 312,
    languages: ["Hindi", "English", "Punjabi"],
    description: "Leading commercial property expert in NCR region with extensive corporate network.",
    badge: "Commercial Expert",
  },
];

const agentServices = [
  {
    title: "Property Valuation",
    description: "Accurate market valuation by certified professionals",
    icon: TrendingUp,
  },
  {
    title: "Legal Documentation",
    description: "Complete assistance with property documentation",
    icon: Award,
  },
  {
    title: "Loan Assistance",
    description: "Home loan guidance and bank tie-ups",
    icon: Building,
  },
  {
    title: "Investment Advisory",
    description: "Expert advice on property investment strategies",
    icon: Users,
  },
];

const Agents = () => {
  useEffect(() => {
    document.title = "Real Estate Agents in India - RealCox.com | Expert Property Consultants";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Expert
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {" "}Real Estate Agents
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with verified and experienced real estate professionals across India. 
              Our agents provide personalized service and expert guidance for all your property needs.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Verified Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
          
          <div className="text-center">
            <Button variant="hero" size="lg">
              Join Our Agent Network
            </Button>
          </div>
        </div>
      </section>
      
      {/* Top Agents */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Top Performing Agents</h2>
            <p className="text-xl text-muted-foreground">
              Connect with our highest-rated real estate professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topAgents.map((agent) => (
              <Card key={agent.id} className="group hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                      />
                      <Badge className="absolute -top-2 -right-2 text-xs px-2 py-1">
                        {agent.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.title}</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{agent.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{agent.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({agent.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Experience:</span>
                        <div className="font-medium">{agent.experience}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Properties Sold:</span>
                        <div className="font-medium">{agent.propertiesSold}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Specialization:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Languages:</span>
                      <div className="text-sm">{agent.languages.join(", ")}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {agent.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button variant="hero" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="premium" size="lg">
              View All Agents
            </Button>
          </div>
        </div>
      </section>
      
      {/* Agent Services */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Services Our Agents Provide</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive real estate services to make your property journey smooth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Become an Agent */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Become a RealCox Agent
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join India's fastest-growing real estate platform. Get access to exclusive leads, 
              marketing tools, and earn higher commissions with our agent program.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Exclusive Leads</h3>
                <p className="text-sm text-muted-foreground">Access to verified buyer and seller leads</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Higher Commissions</h3>
                <p className="text-sm text-muted-foreground">Competitive commission structure</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Marketing Support</h3>
                <p className="text-sm text-muted-foreground">Professional marketing tools and materials</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Apply Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Agents;