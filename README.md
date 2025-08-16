# 🐾 Pet Adoption Platform - Loomio

A comprehensive full-stack web application connecting animal shelters with potential adopters across India. Built with modern technologies to facilitate pet adoption and rescue operations.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🌟 Features

### 🔐 **Role-Based Authentication**
- **Regular Users**: Browse and adopt pets, book appointments
- **Shelter Admins**: Manage animals, upload pictures, handle bookings
- **System Admins**: Create and manage shelters, oversee the platform

### 🏠 **Admin Dashboard**
- Create and manage animal shelters
- View shelter statistics and locations
- Themed glassmorphism UI with responsive design
- Role-based access control

### 🐕 **Shelter Management**
- Add animals with detailed information (breed, age, gender, vaccination status)
- Upload multiple high-quality images per animal
- Organized file storage with shelter-specific folders
- Real-time animal listings and statistics

### 📱 **Responsive Design**
- Mobile-first approach with optimized layouts
- Glassmorphism UI effects with warm color palette
- Adaptive navigation and touch-friendly interfaces
- Cross-platform compatibility

### 📅 **Booking System**
- Schedule appointments to meet animals
- Date and time selection with user preferences
- Real-time booking management
- Email notifications and confirmations

### 🖼️ **Advanced Image Management**
- Organized storage: `shelter_id/animal_id_timestamp.jpg`
- Image validation (type, size, format)
- Automatic cleanup on failures
- Optimized loading and caching

## 🛠️ Tech Stack

### **Frontend**
- **React.js 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with advanced features
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File storage with CDN
- **Row Level Security** - Database-level security policies

### **UI Components**
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Beautiful component library
- **Custom Components** - Themed glassmorphism design
- **Responsive Grid System** - Mobile-optimized layouts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pet-adoption-platform.git
   cd pet-adoption-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the SQL commands in `tables.sql` in your Supabase SQL Editor
   - Create storage bucket named `shelter_images`
   - Set up storage policies for authenticated uploads

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 📊 Database Schema

### **Core Tables**
- `users` - User profiles with role-based access
- `shelters` - Animal shelter information
- `animals` - Pet details with shelter associations
- `animalpictures` - Image URLs linked to animals
- `bookings` - Appointment scheduling system

### **Key Relationships**
- Users ↔ Shelters (shelter admins)
- Animals ↔ Shelters (one-to-many)
- Animals ↔ Pictures (one-to-many)
- Users ↔ Bookings (adoption appointments)

## 🎨 Design System

### **Color Palette**
- **Warm Orange** (`#FF6B35`) - Primary actions and CTAs
- **Caring Blue** (`#4A90E2`) - Trust and reliability
- **Trust Green** (`#27AE60`) - Success states
- **Love Pink** (`#FF69B4`) - Emotional connections

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **Interactive**: Hover states and transitions

### **Components**
- **Glassmorphism Cards** - Translucent backgrounds with blur
- **Gradient Buttons** - Warm color transitions
- **Responsive Tables** - Mobile-optimized data display
- **Modal Dialogs** - Accessible form interactions

## 🔧 Architecture

### **Service Layer Pattern**
```
src/
├── backend/
│   ├── services/          # Business logic layer
│   │   ├── authService.ts
│   │   ├── animalService.ts
│   │   ├── shelterService.ts
│   │   └── userService.ts
│   ├── types/             # TypeScript interfaces
│   └── supabase.ts        # Database client
├── components/            # Reusable UI components
├── pages/                 # Route components
├── utils/                 # Helper functions
└── hooks/                 # Custom React hooks
```

### **Key Services**
- **AuthService** - Authentication and user management
- **AnimalService** - Pet CRUD operations and image uploads
- **ShelterService** - Shelter management and statistics
- **UserService** - User profiles and role management

## 🔒 Security Features

### **Authentication**
- Supabase Auth with email/password
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Session management and auto-refresh

### **Data Protection**
- Row Level Security (RLS) policies
- Input validation and sanitization
- File upload restrictions and validation
- SQL injection prevention

### **Storage Security**
- Organized file structure by shelter
- Access control policies
- Automatic cleanup on failures
- CDN optimization with caching

## 📱 Mobile Optimization

### **Responsive Features**
- **Adaptive Layouts** - Stacked on mobile, grid on desktop
- **Touch-Friendly** - Large buttons and touch targets
- **Performance** - Optimized images and lazy loading
- **Navigation** - Collapsible mobile menu

### **Breakpoints**
- **Mobile**: `< 640px` - Single column, stacked elements
- **Tablet**: `640px - 1024px` - Two columns, condensed layout
- **Desktop**: `> 1024px` - Full multi-column layout

## 🚀 Deployment

### **Recommended Platforms**
- **Vercel** - Automatic deployments from Git
- **Netlify** - Static site hosting with forms
- **Railway** - Full-stack deployment platform

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### **Build Optimization**
- Tree shaking for smaller bundles
- Image optimization and compression
- CSS purging for production
- Service worker for offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use semantic commit messages
- Write tests for new features
- Maintain responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the excellent backend platform
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For the amazing ecosystem
- **Animal Shelters** - For their dedication to animal welfare

## 📞 Support

For support, email support@loomio.com or join our Slack channel.

## 🔗 Links

- **Live Demo**: [Under Development]
- **Documentation**: [Project Wiki](https://github.com/yourusername/pet-adoption-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/pet-adoption-platform/issues)

---

**Made with ❤️ for animal welfare in India** 🇮🇳

*Connecting rescued animals with loving families, one adoption at a time.*