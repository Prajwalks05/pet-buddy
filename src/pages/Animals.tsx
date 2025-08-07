import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimalCard from "@/components/AnimalCard";

const Animals = () => {
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
              Browse through our collection of adorable animals waiting for their forever homes.
            </p>
          </div>
          
          {/* Filters Section */}
          <div className="card-animal p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Filter Animals</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-3 py-2 border rounded-md">
                <option>All Breeds</option>
                <option>Golden Retriever</option>
                <option>Persian Cat</option>
                <option>Labrador</option>
              </select>
              <select className="px-3 py-2 border rounded-md">
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <select className="px-3 py-2 border rounded-md">
                <option>All Ages</option>
                <option>0-1 years</option>
                <option>1-3 years</option>
                <option>3+ years</option>
              </select>
              <select className="px-3 py-2 border rounded-md">
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
              </select>
            </div>
          </div>

          {/* Animals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimalCard
              id="1"
              name="Buddy"
              breed="Golden Retriever"
              gender="Male"
              age={3}
              color="Golden"
              vaccinated={true}
              shelter="Happy Paws Shelter"
              location="Mumbai"
              imageUrl="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop"
            />
            <AnimalCard
              id="2"
              name="Luna"
              breed="Persian Cat"
              gender="Female"
              age={2}
              color="White"
              vaccinated={true}
              shelter="Feline Friends"
              location="Delhi"
              imageUrl="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop"
            />
            <AnimalCard
              id="3"
              name="Max"
              breed="Labrador"
              gender="Male"
              age={4}
              color="Black"
              vaccinated={false}
              shelter="Pet Paradise"
              location="Bangalore"
              imageUrl="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop"
            />
            <AnimalCard
              id="4"
              name="Bella"
              breed="Indian Pariah"
              gender="Female"
              age={1}
              color="Brown"
              vaccinated={true}
              shelter="Stray Care Mumbai"
              location="Mumbai"
              imageUrl="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
            />
            <AnimalCard
              id="5"
              name="Rocky"
              breed="German Shepherd"
              gender="Male"
              age={5}
              color="Brown & Black"
              vaccinated={true}
              shelter="Canine Care Delhi"
              location="Delhi"
              imageUrl="https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop"
            />
            <AnimalCard
              id="6"
              name="Mittens"
              breed="Siamese Cat"
              gender="Female"
              age={3}
              color="Cream"
              vaccinated={true}
              shelter="Cat Haven"
              location="Bangalore"
              imageUrl="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Animals;