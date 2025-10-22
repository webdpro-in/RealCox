import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CompaniesListing from "@/components/CompaniesListing";
import LatestPropertyDetails from "@/components/LatestPropertyDetails";
import PropertyTypes from "@/components/PropertyTypes";
import About from "@/components/About";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "RealCox.com - Global Real Estate Platform | Buy, Sell, Rent Properties Worldwide";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover properties worldwide on RealCox.com. From village homes to luxury estates, commercial buildings to agricultural land. Global real estate made simple with expert support and secure transactions.");
    }
    
    // Debug: Log that the page is loading
    console.log("Main page is loading...");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div id="main-page-content">
        <Header />
        <Hero />
        <CompaniesListing />
        <LatestPropertyDetails />
        <PropertyTypes />
        <About />
        <Services />
        <Footer />
      </div>
    </main>
  );
};

export default Index;