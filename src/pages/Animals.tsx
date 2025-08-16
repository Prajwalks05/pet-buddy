import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import AnimalCard from "@/components/AnimalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter, Search, AlertCircle } from "lucide-react";
import { animalService } from "@/backend/services/animalService";
import { shelterService } from "@/backend/services/shelterService";
import { Animal, Shelter } from "@/backend/types/database";

// Extended Animal type with shelter info
interface AnimalWithShelter extends Animal {
  shelter?: Shelter;
}

const Animals = () => {
  const [allAnimals, setAllAnimals] = useState<AnimalWithShelter[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalWithShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [vaccinatedFilter, setVaccinatedFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  useEffect(() => {
    loadAllAnimals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allAnimals, searchQuery, genderFilter, vaccinatedFilter, ageFilter]);

  const loadAllAnimals = async () => {
    try {
      console.log("🐾 Loading animals from database...");
      const { animals, error: animalsError } = await animalService.getAllAnimals();

      if (animalsError) {
        console.error("❌ Error loading animals:", animalsError);
        setError(animalsError);
        return;
      }

      console.log("✅ Loaded animals:", animals.length, "animals found");
      console.log("📋 Animals data:", animals);

      // Load shelter information for each animal
      const animalsWithShelters = await Promise.all(
        animals.map(async (animal) => {
          console.log(`🏠 Loading shelter for ${animal.name} (shelter_id: ${animal.shelter_id})`);
          const { shelter } = await shelterService.getShelterById(animal.shelter_id);
          console.log(`🏠 Shelter loaded for ${animal.name}:`, shelter?.name || "Unknown");
          return {
            ...animal,
            shelter: shelter || {
              id: "unknown",
              name: "Unknown Shelter",
              location: "Unknown Location",
              contact: ""
            }
          };
        })
      );

      console.log("🎯 Final animals with shelters:", animalsWithShelters);
      setAllAnimals(animalsWithShelters);
    } catch (error) {
      console.error("💥 Exception in loadAllAnimals:", error);
      setError("Failed to load animals");
    } finally {
      console.log("🏁 Loading complete, setting loading to false");
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allAnimals];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.color?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Gender filter
    if (genderFilter && genderFilter !== "all") {
      filtered = filtered.filter(animal => animal.gender === genderFilter);
    }

    // Vaccinated filter
    if (vaccinatedFilter && vaccinatedFilter !== "all") {
      const isVaccinated = vaccinatedFilter === "true";
      filtered = filtered.filter(animal => animal.vaccinated === isVaccinated);
    }

    // Age filter
    if (ageFilter && ageFilter !== "all") {
      filtered = filtered.filter(animal => {
        if (!animal.age) return false;
        switch (ageFilter) {
          case "young": return animal.age <= 2;
          case "adult": return animal.age > 2 && animal.age <= 7;
          case "senior": return animal.age > 7;
          default: return true;
        }
      });
    }

    setFilteredAnimals(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setGenderFilter("all");
    setVaccinatedFilter("all");
    setAgeFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading animals...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Error Loading Animals</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadAllAnimals}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

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
              Browse through our loving animals waiting for their forever homes.
            </p>
          </div>
          
          {/* Filters Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Animals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Name, breed, color..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any gender</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccinated">Vaccination</Label>
                  <Select value={vaccinatedFilter} onValueChange={setVaccinatedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any status</SelectItem>
                      <SelectItem value="true">Vaccinated</SelectItem>
                      <SelectItem value="false">Not vaccinated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age Group</Label>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any age</SelectItem>
                      <SelectItem value="young">Young (0-2 years)</SelectItem>
                      <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredAnimals.length} of {allAnimals.length} animals
            </p>
          </div>

          {/* Animals Grid */}
          {filteredAnimals.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No animals found</h3>
              <p className="text-muted-foreground mb-4">
                {allAnimals.length === 0 
                  ? "No animals are currently available for adoption."
                  : "Try adjusting your filters to see more results."
                }
              </p>
              {allAnimals.length > 0 && (
                <Button onClick={clearFilters}>Clear All Filters</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  id={animal.id}
                  name={animal.name}
                  breed={animal.breed || "Mixed breed"}
                  gender={animal.gender || "Unknown"}
                  age={animal.age || 0}
                  color={animal.color || "Unknown"}
                  vaccinated={animal.vaccinated || false}
                  shelter={animal.shelter?.name || "Unknown Shelter"}
                  location={animal.shelter?.location || "Unknown Location"}
                  imageUrl={animal.pictures?.[0]?.image_url || "/placeholder-animal.jpg"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Animals;