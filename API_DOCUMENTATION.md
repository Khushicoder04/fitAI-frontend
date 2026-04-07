# 📚 FitAI API Documentation & Project Structure

## Project Structure

```
fitai/
├── package.json                 # Root orchestration
├── DEPLOYMENT_REPORT.md        # ✅ Deployment readiness
├── QUICK_START_DEPLOYMENT.md   # ✅ Quick start guide
│
├── backend/                    # Node.js + Express API
│   ├── server.js              # Main entry point
│   ├── .env                   # ✅ Configuration (populated)
│   ├── package.json           # Dependencies
│   │
│   ├── controllers/           # Route handlers
│   │   ├── authController.js       # Signup, login
│   │   ├── recommendController.js  # AI recommendations
│   │   ├── userController.js       # Profile management
│   │   ├── goalController.js       # Adaptive goals
│   │   ├── progressController.js   # Progress tracking
│   │   ├── paymentController.js    # Stripe integration
│   │   └── chatController.js       # AI chat (Pro)
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js            # /api/auth routes
│   │   ├── recommend.js        # /api/recommend routes
│   │   ├── user.js            # /api/user routes
│   │   ├── goal.js            # /api/goal routes
│   │   ├── progress.js        # /api/progress routes
│   │   ├── payment.js         # /api/payment routes
│   │   └── chat.js            # /api/chat routes
│   │
│   ├── models/                # MongoDB schemas
│   │   ├── User.js            # User account + profile
│   │   ├── Subscription.js    # Plan information
│   │   └── Progress.js        # Weight tracking + metrics
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT protection
│   │   ├── validate.js        # Request validation
│   │   └── errorHandler.js    # Error handling
│   │
│   ├── utils/                 # Business logic
│   │   ├── recommendationEngine.js  # AI recommendation logic
│   │   ├── goalPlanner.js           # Adaptive planning algorithm
│   │   ├── exerciseData.js          # Exercise database
│   │   └── nutritionData.js         # Meal database (optional)
│   │
│   └── node_modules/          # ✅ Dependencies installed

└── frontend/                  # React 18 SPA
    ├── package.json          # Dependencies
    ├── .env                  # ✅ Configuration (created)
    ├── .env.example          # Template
    │
    ├── public/
    │   └── index.html        # HTML entry point
    │
    ├── src/
    │   ├── index.js          # React root
    │   ├── index.css         # Global styling
    │   ├── App.js            # Root component + routing
    │   │
    │   ├── components/       # Reusable components
    │   │   ├── common/
    │   │   │   ├── BMIGauge.js
    │   │   │   ├── Chatbot.js        # Pro AI Coach
    │   │   │   ├── ExerciseCard.js
    │   │   │   ├── MealCard.js
    │   │   │   ├── Loader.js
    │   │   │   └── ProBadge.js
    │   │   │
    │   │   └── layout/
    │   │       ├── Navbar.js
    │   │       └── Footer.js
    │   │
    │   ├── pages/            # Route pages
    │   │   ├── Landing.js       # Homepage
    │   │   ├── Login.js         # Login page
    │   │   ├── Signup.js        # Registration
    │   │   ├── Dashboard.js     # Main assessment
    │   │   ├── DietPlan.js      # Diet recommendations
    │   │   ├── WorkoutPlan.js   # Workout schedule
    │   │   ├── GoalPlan.js      # Adaptive goals
    │   │   ├── Profile.js       # User profile
    │   │   ├── Pricing.js       # Subscription plans
    │   │   └── PaymentSuccess.js # Payment callback
    │   │
    │   ├── context/          # State management
    │   │   ├── AuthContext.js      # Authentication
    │   │   ├── RecommendContext.js # Recommendations
    │   │   └── ThemeContext.js     # Dark/light theme
    │   │
    │   ├── hooks/            # Custom React hooks
    │   │   └── useVoice.js    # Voice input
    │   │
    │   ├── utils/
    │   │   └── api.js        # Axios instance + interceptors
    │   │
    │   └── assets/           # Images, icons
    │
    ├── build/                # ✅ Production build (230KB gzipped)
    └── node_modules/         # ✅ Dependencies installed
```

---

## 🔌 API Endpoints

### Authentication Routes
**Base**: `POST /api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | User login |

**Request/Response Examples:**

**POST /signup**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Account created.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isPro": false
  }
}
```

---

### Recommendation Routes
**Base**: `POST /api/recommend`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ Optional | Get AI recommendations |

**Request:**
```json
{
  "age": 28,
  "weight": 75,
  "height": 180,
  "activityLevel": "moderate",
  "goal": "weight_loss",
  "gender": "male",
  "bodyType": "average",
  "experienceLevel": "beginner",
  "injuries": ["knee"],
  "preferences": {
    "diet": "both",
    "allergies": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "bmi": 23.1,
      "bmiCategory": "Normal weight",
      "inferredGoal": "weight_loss",
      "calorieTarget": 2200,
      "proteinTarget": 165
    },
    "diet": {
      "title": "Calorie Deficit Plan",
      "meals": [...]
    },
    "workout": {
      "title": "HIIT + Strength",
      "exercises": [...]
    }
  }
}
```

---

### User Routes
**Base**: `GET/PUT /api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ Required | Get user profile |
| PUT | `/profile` | ✅ Required | Update profile |

---

### Goal Routes
**Base**: `POST /api/goal`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/plan` | ✅ Required | Generate adaptive goal plan |

**Request:**
```json
{
  "targetWeight": 65,
  "timeframeWeeks": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meta": {
      "direction": "loss",
      "targetWeight": 65,
      "estimatedCompletion": "July 10, 2026"
    },
    "weeklySummary": [...]
  }
}
```

---

### Progress Routes
**Base**: `/api/progress`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ Required | Save weight progress |
| GET | `/` | ✅ Required | Get progress history |

**POST Request:**
```json
{
  "weight": 72,
  "notes": "Feeling good!",
  "metrics": {
    "caloriesConsumed": 1800,
    "sleepHours": 7,
    "workoutDone": true
  }
}
```

---

### Payment Routes
**Base**: `/api/payment`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-checkout-session` | ✅ Required | Get Stripe checkout URL |
| POST | `/verify-session` | ✅ Required | Verify payment & upgrade |
| POST | `/webhook` | ❌ | Stripe webhook (optional) |

---

### Chat Routes (Pro Feature)
**Base**: `POST /api/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ Required + Pro | Chat with AI coach |

**Request:**
```json
{
  "message": "What should I eat for breakfast?",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Great question! Here are 3 breakfast options...",
    "timestamp": "2026-04-07T10:30:00Z"
  }
}
```

---

### Health Check
**Base**: `GET /api/health`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Server status check |

**Response:**
```json
{
  "status": "ok",
  "ts": "2026-04-07T10:30:00Z"
}
```

---

## 🔐 Authentication

### JWT Token
- Sent in request header: `Authorization: Bearer {token}`
- Expires in: 7 days
- Algorithm: HS256
- Stored in: localStorage (frontend)

### Password Requirements
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

### Protected Endpoints
All `/api/user`, `/api/goal`, `/api/progress`, `/api/payment`, `/api/chat` routes require valid JWT token.

---

## 🧬 Database Schema

### User
```javascript
{
  name: String,                       // Required
  email: String,                      // Unique, required
  password: String,                   // Hashed
  isPro: Boolean,                     // Default: false
  stripeCustomerId: String,           // From Stripe
  fitnessGoal: String,                // weight_loss, weight_gain, maintain
  profile: {
    age: Number,
    weight: Number,
    height: Number,
    activityLevel: String,
    gender: String,
    calorieTarget: Number,
    goalPlan: {
      targetWeight: Number,
      timeframeWeeks: Number,
      direction: String,
      ...
    }
  },
  history: [{
    date: Date,
    bmi: Number,
    weight: Number,
    goal: String,
    summary: String
  }]
}
```

### Subscription
```javascript
{
  user: ObjectId,                     // Reference to User
  plan: String,                       // free, pro
  stripeSessionId: String,
  stripeSubscriptionId: String,
  startDate: Date,
  endDate: Date,
  isActive: Boolean                   // Default: true
}
```

### Progress
```javascript
{
  user: ObjectId,                     // Reference to User
  date: Date,
  weight: Number,                     // Required
  bmi: Number,
  notes: String,
  metrics: {
    caloriesConsumed: Number,
    caloriesBurned: Number,
    waterIntake: Number,
    sleepHours: Number,
    workoutDone: Boolean
  }
}
```

---

## 🔄 Data Flow

### Recommendation Flow
1. User submits assessment (Dashboard)
2. Frontend POST to `/api/recommend` with form data
3. Backend validates input
4. RecommendationEngine processes:
   - Calculate BMI, BMR, TDEE
   - Generate diet plan
   - Generate workout plan
   - Generate health feedback
5. Return personalized recommendations
6. Frontend displays results
7. If user logged in, save to database

### Payment Flow
1. User clicks "Upgrade to Pro"
2. Redirect to Pricing or prompt signup
3. POST to `/api/payment/create-checkout-session`
4. Stripe returns checkout URL
5. User completes payment on Stripe
6. Redirect to `/payment/success?session_id=...`
7. POST to `/api/payment/verify-session`
8. Backend checks Stripe, upgrades user if valid
9. User can now access Pro features

---

## 📊 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* ... */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

---

## 🚀 Deployment Checklist

- [ ] Frontend `.env` configured with production API URL
- [ ] Backend `.env` configured with production credentials
- [ ] MongoDB Atlas URI updated for production
- [ ] JWT_SECRET changed to strong random value
- [ ] STRIPE_SECRET_KEY set to production key
- [ ] FRONTEND_URL updated to production domain
- [ ] CORS updated to production domain
- [ ] Frontend built: `npm run build`
- [ ] Frontend deployed to static hosting
- [ ] Backend deployed and running
- [ ] Test API endpoints
- [ ] Monitor logs for errors
- [ ] Setup SSL/TLS certificates
- [ ] Configure monitoring/alerting

---

**Last Updated**: April 7, 2026  
**Status**: ✅ Production Ready
