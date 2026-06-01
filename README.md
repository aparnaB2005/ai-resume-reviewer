# AI Resume Reviewer 🤖

A full-stack AI-powered web app that analyzes your resume against a job description and provides an ATS match score, skill gaps, strengths, and rewrite suggestions — instantly.

---

## Features

- 🔐 JWT-based user authentication (register/login)
- 📄 Paste resume + job description → get instant AI feedback
- 📊 ATS match score (0–100) with animated score ring
- ✅ Strengths, ❌ Gaps, 💡 Rewrite suggestions
- 📁 Review history — all past reviews saved and accessible
- 📱 Fully responsive dark UI

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Groq API (LLaMA 3.3 70B) |
| Auth | JWT + bcrypt |

---

## How It Works

1. User registers/logs in → gets a JWT token
2. User pastes resume + job description → React sends POST to Express
3. Express verifies JWT → calls Groq AI with a structured prompt
4. Groq returns JSON → Express saves to MongoDB → sends back to React
5. React renders score ring, strengths, gaps, and suggestions

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

ai-resume-reviewer/
├── backend/
│   ├── models/
│   │   ├── User.js        # User schema + bcrypt hashing
│   │   └── Review.js      # Review schema with AI feedback
│   ├── routes/
│   │   ├── auth.js        # Register + login endpoints
│   │   └── review.js      # AI review + history endpoints
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   └── server.js
└── frontend/
└── src/
├── api/axios.js        # Axios instance + JWT interceptor
├── context/AuthContext.jsx  # Global auth state
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx        # Main review page
│   └── History.jsx     # Past reviews
└── components/
├── Navbar.jsx
├── ReviewResult.jsx    # Score ring + feedback UI
└── ProtectedRoute.jsx