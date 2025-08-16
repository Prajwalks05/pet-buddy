/*users table*/ 
CREATE TABLE users (
  id UUID PRIMARY KEY,                  -- same as auth.users.id
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);



ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN shelter_id UUID REFERENCES shelters(id);

-- Example roles: 'user', 'admin', 'shelter_admin'


-- Link to auth.users
ALTER TABLE users
ADD CONSTRAINT fk_auth_user
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE animalpictures ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for shelters table
CREATE POLICY "Anyone can view shelters" ON shelters
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert shelters" ON shelters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update shelters" ON shelters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for animals table
CREATE POLICY "Anyone can view animals" ON animals
  FOR SELECT USING (true);

CREATE POLICY "Shelter admins can insert animals for their shelter" ON animals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'shelter_admin'
      AND users.shelter_id = animals.shelter_id
    )
  );

CREATE POLICY "Shelter admins can update animals for their shelter" ON animals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'shelter_admin'
      AND users.shelter_id = animals.shelter_id
    )
  );

-- RLS Policies for animal pictures
CREATE POLICY "Anyone can view animal pictures" ON animalpictures
  FOR SELECT USING (true);

CREATE POLICY "Shelter admins can insert pictures for their animals" ON animalpictures
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM animals 
      JOIN users ON users.shelter_id = animals.shelter_id
      WHERE animals.id = animalpictures.animal_id
      AND users.id = auth.uid()
      AND users.role = 'shelter_admin'
    )
  );

CREATE POLICY "Shelter admins can update pictures for their animals" ON animalpictures
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM animals 
      JOIN users ON users.shelter_id = animals.shelter_id
      WHERE animals.id = animalpictures.animal_id
      AND users.id = auth.uid()
      AND users.role = 'shelter_admin'
    )
  );

CREATE POLICY "Shelter admins can delete pictures for their animals" ON animalpictures
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM animals 
      JOIN users ON users.shelter_id = animals.shelter_id
      WHERE animals.id = animalpictures.animal_id
      AND users.id = auth.uid()
      AND users.role = 'shelter_admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);


--shelters table--
CREATE TABLE shelters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact TEXT
);


--animasl table--
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT,
  gender TEXT,
  age INT,
  color TEXT,
  height FLOAT,
  weight FLOAT,
  vaccinated BOOLEAN,
  shelter_id UUID REFERENCES shelters(id)
);



CREATE TABLE animalpictures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animals(id),
  image_url TEXT
);



CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  animal_id UUID REFERENCES animals(id),
  booking_date TIMESTAMP,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW()
);



CREATE OR REPLACE FUNCTION delete_completed_bookings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Completed' THEN
    DELETE FROM bookings WHERE id = NEW.id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_delete_completed_booking
AFTER UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION delete_completed_bookings()
