import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface AnimalCardProps {
  id: string;
  name: string;
  breed: string;
  gender: string;
  age: number;
  color: string;
  vaccinated: boolean;
  shelter: string;
  location: string;
  imageUrl: string;
}

const AnimalCard = ({ 
  id, 
  name, 
  breed, 
  gender, 
  age, 
  color, 
  vaccinated, 
  shelter, 
  location, 
  imageUrl 
}: AnimalCardProps) => {
  return (
    <Card className="card-animal hover-scale overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={`${name} - ${breed}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={vaccinated ? "default" : "secondary"}>
            {vaccinated ? "Vaccinated" : "Not Vaccinated"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <Button variant="ghost" size="icon" className="text-warm-orange">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-2">{breed}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="font-medium">Gender:</span> {gender}
          </div>
          <div>
            <span className="font-medium">Age:</span> {age} years
          </div>
          <div>
            <span className="font-medium">Color:</span> {color}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{shelter}, {location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/animals/${id}`} className="w-full">
          <Button className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;