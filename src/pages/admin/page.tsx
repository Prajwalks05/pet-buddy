import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Building2, 
  Plus, 
  MapPin, 
  Phone, 
  Users, 
  Heart,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { authService } from "@/backend/services/authService";
import { shelterService } from "@/backend/services/shelterService";
import { userService } from "@/backend/services/userService";
import { canManageShelters, requireAuth } from "@/utils/auth";
import { User, Shelter, ShelterCreateData } from "@/backend/types/database";
import Navigation from "@/components/Navigation";

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ShelterCreateData>({
    name: "",
    location: "",
    contact: ""
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { user: currentUser, error: authError } = await authService.getCurrentUser();
      
      if (authError || !currentUser) {
        setError("Please log in to access the admin panel");
        setLoading(false);
        return;
      }

      if (!canManageShelters(currentUser)) {
        setError("You don't have permission to access the admin panel");
        setLoading(false);
        return;
      }

      setUser(currentUser);
      await loadShelters();
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const loadShelters = async () => {
    const { shelters: shelterData, error: shelterError } = await shelterService.getShelters();
    
    if (shelterError) {
      setError(shelterError);
      return;
    }

    setShelters(shelterData);
  };

  const handleInputChange = (field: keyof ShelterCreateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      const { isValid, errors } = await shelterService.validateShelterData(formData);
      
      if (!isValid) {
        setError(errors.join(", "));
        setCreating(false);
        return;
      }

      const { shelter, error: createError } = await shelterService.createShelter(formData);
      
      if (createError) {
        setError(createError);
        setCreating(false);
        return;
      }

      if (shelter) {
        setShelters(prev => [...prev, shelter]);
        setSuccess("Shelter created successfully!");
        setFormData({ name: "", location: "", contact: "" });
        setIsDialogOpen(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-warm-orange" />
            <span className="text-lg">Loading admin panel...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !canManageShelters(user)) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <Card className="card-animal max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                {error || "You don't have permission to access this page."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-warm-orange to-soft-orange rounded-full">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage shelters and oversee the adoption system</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              Welcome back, {user.full_name}
            </Badge>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-hero" onClick={clearMessages}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Shelter
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-warm-orange" />
                    <span>Create New Shelter</span>
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCreateShelter} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shelter Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter shelter name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter shelter location"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Information</Label>
                    <Textarea
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      placeholder="Phone, email, or other contact details"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating}
                      className="btn-hero flex-1"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Shelter
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-trust-green/50 bg-trust-green/10">
            <CheckCircle className="h-4 w-4 text-trust-green" />
            <AlertDescription className="text-trust-green">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-animal">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Shelters</p>
                  <p className="text-2xl font-bold">{shelters.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-warm-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-animal">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Locations</p>
                  <p className="text-2xl font-bold">{new Set(shelters.map(s => s.location)).size}</p>
                </div>
                <MapPin className="h-8 w-8 text-caring-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-animal">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-trust-green">Active</p>
                </div>
                <Heart className="h-8 w-8 text-love-pink" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shelters Table */}
        <Card className="card-animal">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-warm-orange" />
              <span>Registered Shelters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shelters.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No shelters registered</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first shelter to the system.
                </p>
                <Button 
                  className="btn-hero"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Shelter
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shelter Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shelters.map((shelter) => (
                    <TableRow key={shelter.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-warm-orange" />
                          <span>{shelter.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{shelter.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {shelter.contact ? (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{shelter.contact}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No contact info</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-trust-green/10 text-trust-green">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Restrictions Notice */}
        <Card className="card-animal mt-6 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Admin Permissions</h3>
                <p className="text-sm text-amber-700">
                  As an admin, you can create and manage shelters but cannot directly add animals. 
                  Animal management is handled by shelter administrators who are assigned to specific shelters.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;