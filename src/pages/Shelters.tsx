import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Shelters = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Our Partner <span className="gradient-text">Shelters</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We work with verified shelters across India to ensure the best care for animals 
              and the most reliable adoption process.
            </p>
          </div>
          
          <div className="card-animal p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Shelter Network Coming Soon!</h3>
            <p className="text-muted-foreground mb-6">
              We're building partnerships with shelters across India. Soon you'll be able to 
              browse shelters in your area and learn about their amazing work.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <h4 className="font-semibold">Partner Benefits:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Increased visibility for animals</li>
                <li>• Streamlined adoption process</li>
                <li>• Access to our community</li>
                <li>• Free platform usage</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shelters;