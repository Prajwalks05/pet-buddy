import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Calendar, Phone, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "@/backend/services/authService";
import { animalService } from "@/backend/services/animalService";
import { shelterService } from "@/backend/services/shelterService";
import { bookingService } from "@/backend/services/bookingService";
import { User, Animal, Shelter } from "@/backend/types/database";

const AnimalDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  useEffect(() => {
    checkAuthState();
    if (id) {
      loadAnimalDetails(id);
    }
  }, [id]);

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

  const loadAnimalDetails = async (animalId: string) => {
    try {
      const { animal: animalData, error: animalError } = await animalService.getAnimalById(animalId);

      if (animalError) {
        setError(animalError);
        return;
      }

      if (animalData) {
        setAnimal(animalData);

        // Load shelter info
        const { shelter: shelterData, error: shelterError } = await shelterService.getShelterById(animalData.shelter_id);
        if (!shelterError && shelterData) {
          setShelter(shelterData);
        }
      }
    } catch (error) {
      setError("Failed to load animal details");
    }
  };



  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    if (!user || !animal) {
      setBookingError("Please sign in to book an appointment");
      setBookingLoading(false);
      return;
    }

    try {
      const bookingDateTime = `${bookingData.preferredDate}T${bookingData.preferredTime}:00`;

      // Clean the message to avoid any potential issues
      const cleanMessage = bookingData.message?.trim() || "";

      console.log("📅 Creating booking with data:", {
        user_id: user.id,
        animal_id: animal.id,
        booking_date: bookingDateTime,
        preferred_time: bookingData.preferredTime,
        message: cleanMessage
      });

      const { booking, error } = await bookingService.createBooking({
        user_id: user.id,
        animal_id: animal.id,
        booking_date: bookingDateTime,
        preferred_time: bookingData.preferredTime,
        message: cleanMessage
      });

      if (error) {
        setBookingError(error);
        setBookingLoading(false);
        return;
      }

      if (booking) {
        setBookingSuccess(true);
        setBookingData({ preferredDate: "", preferredTime: "", message: "" });

        setTimeout(() => {
          setIsDialogOpen(false);
          setBookingSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setBookingError("Failed to book appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Animal ID Required</h1>
            <p className="text-muted-foreground mb-4">
              Please provide an animal ID to view details.
            </p>
            <Link to="/animals">
              <Button>Browse All Animals</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              {error || "Animal Not Found"}
            </h1>
            <Link to="/animals">
              <Button>Back to Animals</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/animals" className="inline-flex items-center text-warm-orange mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Animals
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={animal.pictures?.[0]?.image_url || "/placeholder-animal.jpg"}
                  alt={`${animal.name} - ${animal.breed || "Unknown breed"}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={animal.vaccinated ? "default" : "secondary"}>
                    {animal.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                  </Badge>
                </div>
              </div>

              {/* Additional Images */}
              {animal.pictures && animal.pictures.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {animal.pictures.slice(1, 4).map((picture, index) => (
                    <img
                      key={picture.id}
                      src={picture.image_url}
                      alt={`${animal.name} - Image ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-4xl font-bold">{animal.name}</h1>
                  <Button variant="ghost" size="icon" className="text-warm-orange">
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-xl text-muted-foreground mb-4">
                  {animal.breed || "Mixed breed"}
                </p>
              </div>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Gender:</span> {animal.gender || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {animal.age ? `${animal.age} years` : "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Color:</span> {animal.color || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {animal.weight ? `${animal.weight} kg` : "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Height:</span> {animal.height ? `${animal.height} cm` : "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Vaccinated:</span> {animal.vaccinated ? "Yes" : "No"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shelter Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Shelter Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-warm-orange" />
                      <span>
                        {shelter ? `${shelter.name}, ${shelter.location}` : "Loading shelter info..."}
                      </span>
                    </div>
                    {shelter?.contact && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-warm-orange" />
                        <span>{shelter.contact}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {loading ? (
                  <Button disabled className="w-full" size="lg">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </Button>
                ) : user ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-hero" size="lg">
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-warm-orange" />
                          <span>Book Appointment with {animal.name}</span>
                        </DialogTitle>
                      </DialogHeader>

                      {bookingSuccess ? (
                        <div className="text-center py-6">
                          <CheckCircle className="h-12 w-12 text-trust-green mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Appointment Booked!</h3>
                          <p className="text-muted-foreground">
                            The shelter will contact you soon to confirm your appointment.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="preferredDate">Preferred Date</Label>
                            <Input
                              id="preferredDate"
                              type="date"
                              value={bookingData.preferredDate}
                              onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="preferredTime">Preferred Time</Label>
                            <Input
                              id="preferredTime"
                              type="time"
                              value={bookingData.preferredTime}
                              onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea
                              id="message"
                              value={bookingData.message}
                              onChange={(e) => handleInputChange("message", e.target.value)}
                              placeholder="Any special requests or questions..."
                              rows={3}
                            />
                          </div>

                          {bookingError && (
                            <Alert className="border-destructive/50 bg-destructive/10">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-destructive">
                                {bookingError}
                              </AlertDescription>
                            </Alert>
                          )}

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
                              disabled={bookingLoading}
                              className="btn-hero flex-1"
                            >
                              {bookingLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                <>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Book Now
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Link to="/auth">
                    <Button className="w-full btn-hero" size="lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      Sign In to Book Appointment
                    </Button>
                  </Link>
                )}

                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Shelter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnimalDetails;