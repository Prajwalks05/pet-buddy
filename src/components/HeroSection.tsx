import { Button } from "@/components/ui/button";
import { Heart, Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-adoption.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Happy families with adopted pets in India"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-orange/10 to-caring-blue/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Perfect
            <span className="gradient-text block">
              Companion Today
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 animate-slide-up max-w-2xl mx-auto">
            India's first comprehensive platform connecting loving families with animals 
            in need of forever homes. Start your adoption journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link to="/animals">
              <Button className="btn-hero text-lg px-8 py-4 w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Browse Animals
              </Button>
            </Link>
            <Link to="/about">
              <Button className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                <Heart className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="card-animal text-center">
              <div className="text-3xl font-bold gradient-text mb-2">500+</div>
              <div className="text-muted-foreground">Animals Adopted</div>
            </div>
            <div className="card-animal text-center">
              <div className="text-3xl font-bold gradient-text mb-2">50+</div>
              <div className="text-muted-foreground">Partner Shelters</div>
            </div>
            <div className="card-animal text-center">
              <div className="text-3xl font-bold gradient-text mb-2">1000+</div>
              <div className="text-muted-foreground">Happy Families</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-warm-orange rounded-full flex justify-center">
          <div className="w-1 h-3 bg-warm-orange rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;