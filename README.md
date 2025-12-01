# 🏋️ Fitness AI Coach (FAAS) - Full-Stack Fitness Application

A modern, AI-powered fitness coaching platform built with Next.js 14, TypeScript, MongoDB, and OpenAI GPT-4.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🎯 **Personalized Dashboard** - Track BMI, calories, weight, and fitness goals
- 🤖 **AI Fitness Assistant** - Chat with GPT-3.5 powered coach for instant advice
- 💪 **Custom Workout Plans** - Algorithm-generated routines based on goals and experience
- ⏱️ **Workout Tracking** - Real-time timer and exercise completion tracking with progress persistence
- 🧮 **Fitness Calculators** - BMI, Calorie, Macro, and Water intake calculators
- 🌓 **Dark/Light Mode** - Toggle between themes with system preference support
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Modern UI** - TailwindCSS with glassmorphism and smooth animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, Custom CSS animations
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **AI Integration**: OpenAI GPT-4 API
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6 or higher) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [OpenAI API Key](https://platform.openai.com/api-keys)

## 🚀 Installation & Setup

### 1. Clone or Navigate to Project

```bash
cd fitness-ai-coach
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fitness-ai-coach
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-ai-coach

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key (get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start MongoDB (if running locally)

```bash
# On macOS/Linux
mongod --dbpath /path/to/your/data/directory

# On Windows
mongod.exe --dbpath C:\path\to\your\data\directory
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
fitness-ai-coach/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── user/            # User management endpoints
│   │   │   ├── fitness/         # Fitness calculations & routines
│   │   │   └── ai/              # AI chat endpoint
│   │   ├── dashboard/           # Dashboard page
│   │   ├── profile/             # User profile page
│   │   ├── ai-coach/            # AI chat interface
│   │   ├── calculators/         # Fitness calculators
│   │   ├── workout-plan/        # Workout plan generator
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   │   ├── ui/                  # UI components (Button, Card, Input)
│   │   └── layout/              # Layout components (Navbar, Footer)
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Theme state
│   ├── lib/                     # Utility libraries
│   │   ├── db.ts               # MongoDB connection
│   │   ├── auth.ts             # JWT utilities
│   │   ├── calculations.ts     # Fitness calculations
│   │   ├── routineGenerator.ts # Workout routine algorithm
│   │   └── utils.ts            # Helper functions
│   └── models/                  # Database models
│       └── User.ts             # User model schema
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update` - Update user profile

### Fitness Features
- `POST /api/fitness/generate-routine` - Generate workout plan
- `POST /api/fitness/calculate-bmi` - Calculate BMI
- `POST /api/fitness/calculate-calories` - Calculate calorie needs

### AI Chat
- `POST /api/ai/chat` - Send message to AI coach

## 🧮 Fitness Calculations

The app includes scientifically-backed formulas:

- **BMI**: Weight (kg) / (Height (m))²
- **BMR**: Mifflin-St Jeor Equation
  - Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
  - Female: (10 × weight) + (6.25 × height) - (5 × age) - 161
- **Maintenance Calories**: BMR × Activity multiplier
- **Macronutrients**: Calculated based on goals (protein/carbs/fats ratios)
- **Water Intake**: 33ml per kg body weight

## 💪 Workout Routine Algorithm

The workout generator considers:

- **User Goals**: Weight loss, muscle building, maintenance, weight gain
- **Experience Level**: Beginner, intermediate, advanced
- **Age**: Adjusts intensity and recovery needs
- **BMI Category**: Customizes for safety and effectiveness
- **Gender**: Optimizes for physiological differences

## 🎨 UI/UX Features

- **Glassmorphism Effects**: Modern frosted glass aesthetic
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Dark Mode**: Automatic system detection with manual toggle
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: HTTP-only cookies prevent XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Middleware checks authentication
- **Secure Headers**: Production-ready security configurations

## 🧪 Testing the Application

### 1. Register a New User
- Navigate to `/register`
- Fill in name, email, and password
- Submit to create account

### 2. Complete Your Profile
- Go to `/profile`
- Add age, gender, height, weight, goal, lifestyle
- Save changes

### 3. View Dashboard
- Navigate to `/dashboard`
- See personalized metrics and stats

### 4. Generate Workout Plan
- Go to `/workout-plan`
- Click "Generate My Workout Plan"
- View weekly routine with exercises
- Use the workout timer to track your session
- Check off exercises as you complete them
- Track your progress with real-time completion percentage

### 5. Use Calculators
- Navigate to `/calculators`
- Try BMI, Calorie, Macro, and Water calculators

### 6. Chat with AI Coach
- Go to `/ai-coach`
- Ask fitness questions
- Get AI-powered responses

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# OR check connection string in .env
MONGODB_URI=mongodb://localhost:27017/fitness-ai-coach
```

### OpenAI API Errors
- Verify API key is correct in `.env`
- Check API quota: https://platform.openai.com/usage
- Ensure billing is set up on OpenAI account

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📦 Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables (Production)
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (min 32 characters)
- Use MongoDB Atlas for database
- Enable HTTPS for secure cookies
- Set proper CORS origins

### Recommended Platforms
- **Vercel**: Easiest deployment (built for Next.js)
- **Netlify**: Good alternative with edge functions
- **AWS/GCP/Azure**: Full control, requires more setup
- **Railway/Render**: Simple with database hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Lucide for beautiful icons
- MongoDB for the database solution

## 📧 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Email: support@fitnessaicoach.com
- Documentation: [docs link]

## 🔮 Future Enhancements

- [x] ~~Workout timer and exercise completion tracking~~
- [ ] Progress tracking with charts and graphs
- [ ] Meal planning and nutrition tracking
- [ ] Exercise video library
- [ ] Social features (friends, challenges)
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] Advanced analytics and insights
- [ ] Workout history database
- [ ] Export routines to PDF
- [ ] Multi-language support

---

**Built with ❤️ by the Fitness AI Coach Team**

🌟 **Star this repo if you find it helpful!** 🌟
