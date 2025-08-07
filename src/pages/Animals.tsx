import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Animals = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Find Your Perfect <span className="gradient-text">Companion</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through our collection of adorable animals waiting for their forever homes.
            </p>
          </div>
          
          {/* Filters and animal grid will be added here */}
          <div className="card-animal p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Coming Soon!</h3>
            <p className="text-muted-foreground">
              Our animal browsing and filtering system is being developed. 
              Check back soon to find your perfect companion!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Animals;