import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { authService, SignUpData } from "@/backend/services/authService";
import { shelterService } from "@/backend/services/shelterService";
import { Shelter } from "@/backend/types/database";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const navigate = useNavigate();

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  // Sign up form state
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
    role: "user",
    shelter_id: ""
  });

  useEffect(() => {
    // Check if user is already authenticated
    checkExistingAuth();
    // Load shelters for shelter admin signup
    loadShelters();
  }, []);

  const checkExistingAuth = async () => {
    const { user } = await authService.getCurrentUser();
    if (user) {
      redirectBasedOnRole(user.role);
    }
  };

  const loadShelters = async () => {
    const { shelters: shelterData } = await shelterService.getShelters();
    if (shelterData) {
      setShelters(shelterData);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'shelter_admin':
        navigate('/shelter');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { user, error: authError } = await authService.signIn(
        signInData.email,
        signInData.password
      );

      if (authError) {
        setError(authError);
        setIsLoading(false);
        return;
      }

      if (user) {
        setSuccess("Successfully signed in! Redirecting...");
        setTimeout(() => {
          redirectBasedOnRole(user.role);
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!signUpData.full_name || !signUpData.email || !signUpData.password) {
        setError("Please fill in all required fields (Name, Email, Password)");
        setIsLoading(false);
        return;
      }

      // Validate role selection
      if (!signUpData.role) {
        setError("Please select what you want to do (adopt pets or manage shelter)");
        setIsLoading(false);
        return;
      }

      // Validate shelter selection for shelter admin
      if (signUpData.role === 'shelter_admin') {
        if (shelters.length === 0) {
          setError("No shelters available. Please sign up as a regular user or contact an admin.");
          setIsLoading(false);
          return;
        }
        if (!signUpData.shelter_id) {
          setError("Please select which shelter you want to manage");
          setIsLoading(false);
          return;
        }
      }

      const { user, error: authError } = await authService.signUp(signUpData);

      if (authError) {
        setError(authError);
        setIsLoading(false);
        return;
      }

      if (user) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          redirectBasedOnRole(user.role);
        }, 1500);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("Database setup error. Please make sure you've run the SQL setup script and disabled email confirmation in Supabase.");
      setIsLoading(false);
    }
  };

  const handleSignInInputChange = (field: keyof typeof signInData, value: string) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSignUpInputChange = (field: keyof SignUpData, value: string) => {
    setSignUpData(prev => ({ 
      ...prev, 
      [field]: value,
      // Clear shelter_id if role changes from shelter_admin
      ...(field === 'role' && value !== 'shelter_admin' ? { shelter_id: "" } : {})
    }));
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to <span className="gradient-text">Loomio</span>
            </h1>
            <p className="text-muted-foreground">
              Join our community and start your adoption journey
            </p>
          </div>

          <Card className="card-animal">
            <CardHeader className="text-center">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              {error && (
                <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-trust-green/50 bg-trust-green/10">
                  <CheckCircle className="h-4 w-4 text-trust-green" />
                  <AlertDescription className="text-trust-green">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email *</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => handleSignInInputChange("email", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password *</Label>
                      <Input 
                        id="signin-password" 
                        type="password" 
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => handleSignInInputChange("password", e.target.value)}
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-hero" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="Enter your full name"
                        value={signUpData.full_name}
                        onChange={(e) => handleSignUpInputChange("full_name", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => handleSignUpInputChange("email", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input 
                        id="signup-phone" 
                        type="tel" 
                        placeholder="Enter your phone number"
                        value={signUpData.phone}
                        onChange={(e) => handleSignUpInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-address">Address</Label>
                      <Input 
                        id="signup-address" 
                        type="text" 
                        placeholder="Enter your address"
                        value={signUpData.address}
                        onChange={(e) => handleSignUpInputChange("address", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-role">I want to:</Label>
                      <Select 
                        value={signUpData.role} 
                        onValueChange={(value) => handleSignUpInputChange("role", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Adopt a Pet (Regular User)</SelectItem>
                          <SelectItem value="shelter_admin">Manage Animals at a Shelter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {signUpData.role === 'shelter_admin' && (
                      <div className="space-y-2">
                        <Label htmlFor="signup-shelter">Which Shelter? *</Label>
                        <Select 
                          value={signUpData.shelter_id} 
                          onValueChange={(value) => handleSignUpInputChange("shelter_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your shelter" />
                          </SelectTrigger>
                          <SelectContent>
                            {shelters.map((shelter) => (
                              <SelectItem key={shelter.id} value={shelter.id}>
                                {shelter.name} - {shelter.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {shelters.length === 0 && (
                          <Alert className="mt-2 border-amber-200 bg-amber-50/50">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-700 text-xs">
                              No shelters available yet. Please contact an admin to create shelters first, or sign up as a regular user to adopt pets.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => handleSignUpInputChange("password", e.target.value)}
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-hero" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
                <div className="text-xs text-muted-foreground bg-gentle-blue/10 p-3 rounded-lg">
                  <p className="font-medium mb-1">Quick Start:</p>
                  <p>• Choose "Adopt a Pet" to browse and adopt animals</p>
                  <p>• Choose "Manage Animals" if you work at a shelter</p>
                  <p>• No email verification required - start immediately!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;