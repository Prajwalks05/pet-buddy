import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Calendar, Phone, ArrowLeft } from "lucide-react";

// This would normally come from your database
const dummyAnimals = [
  {
    id: "1",
    name: "Buddy",
    breed: "Golden Retriever",
    gender: "Male",
    age: 3,
    color: "Golden",
    height: 24,
    weight: 30,
    vaccinated: true,
    shelter: "Happy Paws Shelter",
    location: "Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop",
    description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going for long walks. He's great with children and other pets.",
    shelterContact: "+91 98765 43210"
  },
  {
    id: "2",
    name: "Luna",
    breed: "Persian Cat",
    gender: "Female",
    age: 2,
    color: "White",
    height: 10,
    weight: 4,
    vaccinated: true,
    shelter: "Feline Friends",
    location: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop",
    description: "Luna is a gentle and affectionate Persian cat who enjoys quiet environments and loves to be pampered. She's perfect for a calm household.",
    shelterContact: "+91 87654 32109"
  }
];

const AnimalDetails = () => {
  const { id } = useParams();
  const animal = dummyAnimals.find(a => a.id === id);

  if (!animal) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Animal Not Found</h1>
            <Link to="/animals">
              <Button>Back to Animals</Button>
            </Link>
          </div>
        </main>
        <Footer />
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
                  src={animal.imageUrl} 
                  alt={`${animal.name} - ${animal.breed}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={animal.vaccinated ? "default" : "secondary"}>
                    {animal.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                  </Badge>
                </div>
              </div>
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
                <p className="text-xl text-muted-foreground mb-4">{animal.breed}</p>
                <p className="text-muted-foreground">{animal.description}</p>
              </div>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Gender:</span> {animal.gender}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {animal.age} years
                    </div>
                    <div>
                      <span className="font-medium">Color:</span> {animal.color}
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {animal.weight} kg
                    </div>
                    <div>
                      <span className="font-medium">Height:</span> {animal.height} inches
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
                      <span>{animal.shelter}, {animal.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-warm-orange" />
                      <span>{animal.shelterContact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link to="/auth">
                  <Button className="w-full btn-hero" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Shelter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnimalDetails;