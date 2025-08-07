import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Auth = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-animal p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">
              Join <span className="gradient-text">PawPledge India</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Authentication system is being developed. Soon you'll be able to create an account 
              and start your adoption journey!
            </p>
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="font-semibold mb-2">What you'll get:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse and save favorite animals</li>
                  <li>• Book appointments with shelters</li>
                  <li>• Track your adoption journey</li>
                  <li>• Connect with our community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;