import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-warm-orange" />
            <span className="font-bold text-xl gradient-text">PawPledge India</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-warm-orange transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/animals" 
              className="text-foreground hover:text-warm-orange transition-colors font-medium"
            >
              Find Animals
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-warm-orange transition-colors font-medium"
            >
              About Us
            </Link>
            <Link 
              to="/shelters" 
              className="text-foreground hover:text-warm-orange transition-colors font-medium"
            >
              Shelters
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:text-warm-orange">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="btn-hero">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 border border-white/20">
              <Link
                to="/"
                className="block px-3 py-2 text-foreground hover:text-warm-orange font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/animals"
                className="block px-3 py-2 text-foreground hover:text-warm-orange font-medium"
                onClick={() => setIsOpen(false)}
              >
                Find Animals
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-foreground hover:text-warm-orange font-medium"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/shelters"
                className="block px-3 py-2 text-foreground hover:text-warm-orange font-medium"
                onClick={() => setIsOpen(false)}
              >
                Shelters
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="btn-hero w-full mt-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;