import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    Heart,
    Plus,
    Upload,
    Camera,
    AlertCircle,
    CheckCircle,
    Loader2,
    PawPrint,
    Building2,
    MapPin,
    Edit,
    Trash2,
    Image as ImageIcon
} from "lucide-react";
import { authService } from "@/backend/services/authService";
import { animalService } from "@/backend/services/animalService";
import { shelterService } from "@/backend/services/shelterService";
import { canManageAnimals, isShelterAdmin, getUserShelter } from "@/utils/auth";
import { User, Animal, Shelter, AnimalCreateData } from "@/backend/types/database";
import Navigation from "@/components/Navigation";

const ShelterPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [shelter, setShelter] = useState<Shelter | null>(null);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Form state
    const [formData, setFormData] = useState<AnimalCreateData>({
        name: "",
        breed: "",
        gender: "",
        age: 0,
        color: "",
        height: 0,
        weight: 0,
        vaccinated: false,
        shelter_id: ""
    });

    useEffect(() => {
        checkAuthAndLoadData();
    }, []);

    const checkAuthAndLoadData = async () => {
        try {
            const { user: currentUser, error: authError } = await authService.getCurrentUser();

            if (authError || !currentUser) {
                setError("Please log in to access the shelter panel");
                setLoading(false);
                return;
            }

            if (!isShelterAdmin(currentUser)) {
                setError("You don't have permission to access the shelter panel");
                setLoading(false);
                return;
            }

            const userShelterId = getUserShelter(currentUser);
            console.log('Current user:', currentUser);
            console.log('User shelter ID:', userShelterId);

            if (!userShelterId) {
                setError("You are not associated with any shelter");
                setLoading(false);
                return;
            }

            setUser(currentUser);
            setFormData(prev => ({ ...prev, shelter_id: userShelterId }));
            console.log('Form data shelter_id set to:', userShelterId);

            await Promise.all([
                loadShelterInfo(userShelterId),
                loadAnimals(userShelterId)
            ]);
        } catch (err) {
            setError("Failed to load shelter data");
        } finally {
            setLoading(false);
        }
    };

    const loadShelterInfo = async (shelterId: string) => {
        const { shelter: shelterData, error: shelterError } = await shelterService.getShelterById(shelterId);

        if (shelterError) {
            setError(shelterError);
            return;
        }

        setShelter(shelterData);
    };

    const loadAnimals = async (shelterId: string) => {
        const { animals: animalData, error: animalError } = await animalService.getAnimalsByShelter(shelterId);

        if (animalError) {
            setError(animalError);
            return;
        }

        setAnimals(animalData);
    };

    const handleInputChange = (field: keyof AnimalCreateData, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            // Validate files before setting them
            const { isValid, errors } = animalService.validateImageFiles(files);

            if (!isValid) {
                setError(errors.join(' '));
                return;
            }

            setSelectedFiles(files);
            setError(null); // Clear any previous errors
        }
    };

    const handleCreateAnimal = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError(null);
        setSuccess(null);

        try {
            // Validate form data
            const { isValid, errors } = await animalService.validateAnimalData(formData);

            if (!isValid) {
                setError(errors.join(", "));
                setCreating(false);
                return;
            }

            console.log('Creating animal with form data:', formData);
            const { animal, error: createError } = await animalService.createAnimal(formData);

            if (createError) {
                setError(createError);
                setCreating(false);
                return;
            }

            if (animal) {
                console.log('Animal created successfully:', animal);
                // Upload pictures if any
                if (selectedFiles.length > 0) {
                    setUploading(true);
                    console.log('Uploading pictures for animal:', animal.id);
                    const { pictures, error: uploadError } = await animalService.uploadAnimalPictures(
                        animal.id,
                        selectedFiles
                    );

                    if (uploadError) {
                        setError(`Animal created but failed to upload pictures: ${uploadError}`);
                    } else {
                        animal.pictures = pictures;
                    }
                    setUploading(false);
                }

                setAnimals(prev => [...prev, animal]);
                setSuccess("Animal added successfully!");
                setFormData({
                    name: "",
                    breed: "",
                    gender: "",
                    age: 0,
                    color: "",
                    height: 0,
                    weight: 0,
                    vaccinated: false,
                    shelter_id: formData.shelter_id
                });
                setSelectedFiles([]);
                setIsDialogOpen(false);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setCreating(false);
            setUploading(false);
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
                        <span className="text-lg">Loading shelter panel...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user || !isShelterAdmin(user) || !shelter) {
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
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-caring-blue to-gentle-blue rounded-full w-fit">
                            <PawPrint className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Shelter Dashboard</h1>
                            <p className="text-muted-foreground text-sm sm:text-base">Manage animals at {shelter.name}</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <Badge variant="secondary" className="text-sm w-fit">
                                Welcome, {user.full_name}
                            </Badge>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="h-4 w-4" />
                                    <span className="truncate">{shelter.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate">{shelter.location}</span>
                                </div>
                            </div>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="btn-hero w-full sm:w-auto" onClick={clearMessages}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Add New Animal</span>
                                    <span className="sm:hidden">Add Animal</span>
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center space-x-2">
                                        <PawPrint className="h-5 w-5 text-caring-blue" />
                                        <span>Add New Animal</span>
                                    </DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleCreateAnimal} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Animal Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Enter animal name"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="breed">Breed</Label>
                                            <Input
                                                id="breed"
                                                value={formData.breed}
                                                onChange={(e) => handleInputChange("breed", e.target.value)}
                                                placeholder="Enter breed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(value) => handleInputChange("gender", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Unknown">Unknown</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age (years)</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                min="0"
                                                max="30"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                                                placeholder="Age"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="color">Color</Label>
                                            <Input
                                                id="color"
                                                value={formData.color}
                                                onChange={(e) => handleInputChange("color", e.target.value)}
                                                placeholder="Enter color"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="height">Height (cm)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={formData.height}
                                                onChange={(e) => handleInputChange("height", parseFloat(e.target.value) || 0)}
                                                placeholder="Height in cm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={formData.weight}
                                                onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                                                placeholder="Weight in kg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="vaccinated"
                                            checked={formData.vaccinated}
                                            onCheckedChange={(checked) => handleInputChange("vaccinated", checked)}
                                        />
                                        <Label htmlFor="vaccinated">Vaccinated</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pictures">Animal Pictures</Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                id="pictures"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <label htmlFor="pictures" className="cursor-pointer">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Camera className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        Click to upload pictures or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PNG, JPG, GIF up to 10MB each
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedFiles.length} file(s) selected
                                                </p>
                                            </div>
                                        )}
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
                                            disabled={creating || uploading}
                                            className="btn-hero flex-1"
                                        >
                                            {creating ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : uploading ? (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Animal
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                    <Card className="card-animal">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Animals</p>
                                    <p className="text-xl sm:text-2xl font-bold">{animals.length}</p>
                                </div>
                                <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 text-caring-blue" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-animal">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Vaccinated</p>
                                    <p className="text-xl sm:text-2xl font-bold text-trust-green">
                                        {animals.filter(a => a.vaccinated).length}
                                    </p>
                                </div>
                                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-trust-green" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-animal">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">With Photos</p>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {animals.filter(a => a.pictures && a.pictures.length > 0).length}
                                    </p>
                                </div>
                                <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-warm-orange" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-animal">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                                    <p className="text-xl sm:text-2xl font-bold text-love-pink">{animals.length}</p>
                                </div>
                                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-love-pink" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Animals Table */}
                <Card className="card-animal">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                            <PawPrint className="h-5 w-5 text-caring-blue" />
                            <span className="truncate">Animals at {shelter.name}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {animals.length === 0 ? (
                            <div className="text-center py-8">
                                <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No animals registered</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start by adding animals that need homes to your shelter.
                                </p>
                                <Button
                                    className="btn-hero"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Animal
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[120px]">Name</TableHead>
                                            <TableHead className="hidden sm:table-cell">Breed</TableHead>
                                            <TableHead className="min-w-[100px]">Age/Gender</TableHead>
                                            <TableHead className="hidden md:table-cell">Status</TableHead>
                                            <TableHead className="hidden sm:table-cell">Photos</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {animals.map((animal) => (
                                            <TableRow key={animal.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <PawPrint className="h-4 w-4 text-caring-blue flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold truncate">{animal.name}</p>
                                                            {animal.color && (
                                                                <p className="text-xs text-muted-foreground truncate">{animal.color}</p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground sm:hidden">
                                                                {animal.breed || 'Unknown breed'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="text-sm">{animal.breed || <span className="text-muted-foreground">Unknown</span>}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p>{animal.age ? `${animal.age}y` : 'Unknown'}</p>
                                                        <p className="text-muted-foreground text-xs">{animal.gender || 'Unknown'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex flex-col space-y-1">
                                                        <Badge
                                                            variant={animal.vaccinated ? "secondary" : "outline"}
                                                            className={`text-xs ${animal.vaccinated ? "bg-trust-green/10 text-trust-green" : ""}`}
                                                        >
                                                            {animal.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                                                        </Badge>
                                                        <Badge variant="secondary" className="bg-love-pink/10 text-love-pink text-xs">
                                                            Available
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex items-center space-x-2">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {animal.pictures?.length || 0} photo{(animal.pictures?.length || 0) !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Restrictions Notice */}
                <Card className="card-animal mt-6 border-amber-200 bg-amber-50/50">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-1 text-sm sm:text-base">Shelter Admin Permissions</h3>
                                <p className="text-xs sm:text-sm text-amber-700">
                                    As a shelter admin, you can add and manage animals for your shelter but cannot create new shelters.
                                    All animals you add will be automatically associated with {shelter.name}.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ShelterPage;