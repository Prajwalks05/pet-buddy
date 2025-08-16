import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Heart, Shield, MapPin, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your perfect companion with advanced filters for breed, age, location, and more.",
    color: "text-warm-orange"
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Schedule visits to meet animals you're interested in adopting with our simple booking system.",
    color: "text-caring-blue"
  },
  {
    icon: Heart,
    title: "Verified Shelters",
    description: "All our partner shelters are verified and committed to animal welfare and responsible adoption.",
    color: "text-trust-green"
  },
  {
    icon: Shield,
    title: "Safe Process",
    description: "Secure and transparent adoption process ensuring the best match for both families and animals.",
    color: "text-warm-orange"
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description: "Connect with shelters across India and find animals in need of homes in your area.",
    color: "text-caring-blue"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of pet parents and get ongoing support throughout your adoption journey.",
    color: "text-trust-green"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Loomio</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've made animal adoption simple, safe, and meaningful for families across India.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-animal group hover:shadow-xl transition-all duration-300 border-0"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <feature.icon 
                    className={`h-12 w-12 mx-auto ${feature.color} group-hover:scale-110 transition-transform duration-300`} 
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;