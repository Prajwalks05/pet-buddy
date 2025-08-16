import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-warm-orange/5 to-caring-blue/5 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-warm-orange" />
              <span className="font-bold text-xl gradient-text">Loomio</span>
            </Link>
            <p className="text-muted-foreground">
              Connecting loving families with animals in need across India. 
              Your journey to finding a perfect companion starts here.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-warm-orange cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-warm-orange cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-warm-orange cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/animals" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Browse Animals
              </Link>
              <Link to="/shelters" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Partner Shelters
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                About Us
              </Link>
              <Link to="/auth" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Login / Register
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Adoption Process
              </a>
              <a href="#" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                FAQs
              </a>
              <a href="#" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Contact Support
              </a>
              <a href="#" className="block text-muted-foreground hover:text-warm-orange transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-warm-orange" />
                <span>support@loomio.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-warm-orange" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-warm-orange" />
                <span>Bengaluru ,Karnataka ,India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-muted-foreground">
            © 2024 Loomio. Made with ❤️ for animals in need.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;