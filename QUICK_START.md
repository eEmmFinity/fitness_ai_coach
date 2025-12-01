# ⚡ Quick Start Guide - Fitness AI Coach

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 minute)
```bash
cd fitness-ai-coach
npm install
```

### Step 2: Setup Environment (2 minutes)
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
# Required: MongoDB
MONGODB_URI=mongodb://localhost:27017/fitness-ai-coach

# Required: JWT Secret
JWT_SECRET=my-super-secret-key-change-in-production

# Required: OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-api-key-here

# Auto-configured
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Start MongoDB (30 seconds)
```bash
# On macOS/Linux:
mongod

# On Windows:
mongod.exe

# OR use MongoDB Atlas (cloud) - just paste your connection string in .env
```

### Step 4: Run the App (30 seconds)
```bash
npm run dev
```

### Step 5: Open Browser (10 seconds)
Navigate to: **http://localhost:3000**

---

## 🎯 First-Time User Journey

### 1. Register Account
- Click "Sign Up" button
- Enter name, email, and password
- Submit form → Auto-login to dashboard

### 2. Complete Profile
- Click "Complete Profile" button on dashboard
- Enter:
  - Age: 25
  - Gender: Male/Female
  - Height: 175 cm
  - Weight: 70 kg
  - Goal: Muscle Building
  - Lifestyle: Moderately Active
  - Experience: Beginner
- Save → BMI and calories auto-calculate

### 3. Try Features

#### Dashboard
- View your stats (BMI, calories, weight, goal)
- See quick action cards

#### Workout Plan
- Click "View Workout Plan" or navigate to `/workout-plan`
- Click "Generate My Workout Plan"
- View weekly routine with exercises, sets, reps

#### AI Coach
- Navigate to `/ai-coach`
- Try quick questions or ask anything:
  - "How do I build muscle fast?"
  - "What should I eat before workout?"
  - "Can you explain proper squat form?"

#### Calculators
- Navigate to `/calculators`
- Try all 4 calculators:
  - **BMI**: Weight 70kg, Height 175cm
  - **Calorie**: Full stats for daily calories
  - **Macro**: Target 2000 kcal, Goal: Muscle Building
  - **Water**: Weight 70kg → 2.3L daily

---

## 🔧 Troubleshooting

### MongoDB Not Connecting?
```bash
# Check if MongoDB is running:
mongosh

# If not installed, install MongoDB:
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com
```

**OR Use MongoDB Atlas (Free Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Paste in `.env` as `MONGODB_URI`

### OpenAI API Not Working?
- Check API key is correct in `.env`
- Verify you have credits: https://platform.openai.com/usage
- Ensure billing is set up on OpenAI account

### Port 3000 Already in Use?
```bash
# Kill the process:
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# OR change port:
npm run dev -- -p 3001
```

### Build Errors?
```bash
# Clear everything and reinstall:
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 📱 Test User Credentials (for testing)

Once you register, use these values for complete testing:

**Profile Settings:**
- Age: 25
- Gender: Male
- Height: 175 cm
- Weight: 70 kg
- Goal: Muscle Building
- Lifestyle: Moderately Active
- Experience Level: Beginner

**Expected Results:**
- BMI: 22.9 (Normal weight)
- BMR: ~1,680 kcal
- Maintenance: ~2,600 kcal
- Workout: 4-day intermediate split

---

## 🎨 Feature Showcase

### Home Page (/)
Beautiful landing page with:
- Hero section
- Feature cards
- Benefits section
- Call-to-action

### Dashboard (/dashboard)
Personalized overview with:
- Stats cards (BMI, calories, weight, goal)
- Quick actions (workout plan, AI coach)
- Calculator shortcuts

### AI Coach (/ai-coach)
Chat interface with:
- Real-time responses
- Conversation history
- Quick question suggestions
- Typing indicators

### Workout Plan (/workout-plan)
Routine generator with:
- Weekly schedule
- Exercise details (sets, reps, rest)
- Tips and notes
- Nutrition advice

### Calculators (/calculators)
4 scientific calculators:
- BMI (body mass index)
- Calorie (BMR + maintenance)
- Macro (protein/carbs/fats)
- Water (daily intake)

### Profile (/profile)
Complete profile management:
- Personal details
- Fitness metrics
- Goals and preferences
- Auto-calculations

---

## 🌟 Pro Tips

1. **Complete Profile First**: Unlock all personalized features
2. **Use AI Coach**: Ask anything about fitness, nutrition, form
3. **Save Workout Plan**: Screenshot or note it down for gym
4. **Check Calculators**: Update as your weight changes
5. **Dark Mode**: Toggle in navbar for comfortable viewing
6. **Mobile Friendly**: Works great on phones and tablets

---

## 📊 Quick Reference

### API Endpoints
```
POST /api/auth/register          - Register
POST /api/auth/login             - Login
POST /api/auth/logout            - Logout
GET  /api/auth/me                - Get user
GET  /api/user/profile           - Get profile
PUT  /api/user/update            - Update profile
POST /api/fitness/generate-routine   - Get workout
POST /api/fitness/calculate-bmi      - Calculate BMI
POST /api/fitness/calculate-calories - Calculate calories
POST /api/ai/chat                - Chat with AI
```

### Routes
```
/                 - Home page (public)
/login            - Login page (public)
/register         - Register page (public)
/dashboard        - Dashboard (protected)
/profile          - Profile page (protected)
/ai-coach         - AI chat (protected)
/workout-plan     - Workout generator (protected)
/calculators      - Calculator hub (public)
/calculators/bmi  - BMI calculator (public)
/calculators/calorie  - Calorie calculator (public)
/calculators/macros   - Macro calculator (public)
/calculators/water    - Water calculator (public)
```

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Add environment variables in Vercel dashboard
```

### Environment Variables (Production)
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (32+ characters)
- Use MongoDB Atlas for database
- Add OpenAI API key
- Enable HTTPS (automatic on Vercel)

---

## ✅ Success Checklist

- [ ] MongoDB running
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Opened http://localhost:3000
- [ ] Registered test account
- [ ] Completed profile
- [ ] Tried all features
- [ ] Tested calculators
- [ ] Chatted with AI
- [ ] Generated workout plan

---

## 🎉 You're Ready!

Your Fitness AI Coach app is now running. Start your fitness journey today!

**Need Help?**
- Check `README.md` for detailed docs
- Review `PROJECT_SUMMARY.md` for technical details
- Open an issue on GitHub

**Happy Training! 💪🏋️‍♂️**
