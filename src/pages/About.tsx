import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every animal deserves love, care, and a safe home. We prioritize the welfare of animals above all else."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We believe in building a strong community of animal lovers who support each other and the animals."
    },
    {
      icon: Award,
      title: "Responsible Adoption",
      description: "We ensure every adoption is carefully considered with proper screening and ongoing support."
    },
    {
      icon: Globe,
      title: "Nationwide Impact",
      description: "Our mission extends across India, helping animals and families in every corner of the country."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About <span className="gradient-text">PawPledge India</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              PawPledge India was born from a simple belief: every animal deserves a loving home, 
              and every family deserves the joy of a loyal companion. We're India's first 
              comprehensive platform dedicated to making animal adoption accessible, 
              transparent, and meaningful.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gentle-blue/10 to-love-pink/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  We're working to bridge the gap between animals in need and families ready to love them. 
                  Through technology and compassion, we're making adoption easier, safer, and more 
                  transparent for everyone involved.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every successful adoption through our platform is a life saved and a family completed. 
                  We're not just matching pets with people – we're creating lifelong bonds that enrich 
                  both human and animal lives.
                </p>
              </div>
              <div className="card-animal">
                <h3 className="text-2xl font-semibold mb-4 gradient-text">Our Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Animals Rescued</span>
                    <span className="font-bold text-warm-orange">500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Partner Shelters</span>
                    <span className="font-bold text-warm-orange">50+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Happy Families</span>
                    <span className="font-bold text-warm-orange">1000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cities Covered</span>
                    <span className="font-bold text-warm-orange">25+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do and every decision we make.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="card-animal border-0">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-12 w-12 mx-auto mb-4 text-warm-orange" />
                    <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-warm-orange/5 to-caring-blue/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you're looking to adopt, volunteer, or partner with us, there are many ways 
              to be part of the PawPledge India family. Together, we can give every animal the 
              loving home they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/animals" className="btn-hero inline-flex items-center justify-center px-8 py-3">
                Browse Animals
              </a>
              <a href="/auth" className="btn-secondary inline-flex items-center justify-center px-8 py-3">
                Get Involved
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;