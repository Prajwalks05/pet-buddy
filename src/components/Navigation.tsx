import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Menu, X, User, LogOut, Settings, Building2, PawPrint } from "lucide-react";
import { authService } from "@/backend/services/authService";
import { User as UserType } from "@/backend/types/database";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const { user: currentUser } = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'shelter_admin':
        return '/shelter';
      default:
        return '/';
    }
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin':
        return 'Admin';
      case 'shelter_admin':
        return 'Shelter Admin';
      default:
        return 'User';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/loomio_logo.png" className="rounded-full" height={56} width={56} alt="Logo" />            <span className="font-bold text-xl gradient-text">Loomio</span>
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

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.full_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getRoleDisplay()}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center">
                      {user.role === 'admin' ? (
                        <Building2 className="h-4 w-4 mr-2" />
                      ) : user.role === 'shelter_admin' ? (
                        <PawPrint className="h-4 w-4 mr-2" />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
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
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{getRoleDisplay()}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        {user.role === 'admin' ? (
                          <Building2 className="h-4 w-4 mr-2" />
                        ) : user.role === 'shelter_admin' ? (
                          <PawPrint className="h-4 w-4 mr-2" />
                        ) : (
                          <User className="h-4 w-4 mr-2" />
                        )}
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive mt-2"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;