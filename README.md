# 🚀 GetMePlaced — Interview Prep Platform

A full-stack interview preparation platform with **company-wise questions**, **mock interviews**, and **progress analytics**.

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | SPA framework |
| React Router v6 | Client-side routing + protected routes |
| Tailwind CSS | Utility-first styling |
| Framer Motion | 3D transitions and animations |
| Three.js | 3D background and hero visuals |
| Axios | HTTP client with JWT interceptors |
| React Hot Toast | Notifications |
| Recharts | Progress dashboards and stats |
| Zustand | Lightweight global state |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API framework |
| Motor / Beanie | Async MongoDB ODM |
| python-jose | JWT token generation and verification |
| passlib / bcrypt | Password hashing |
| Pydantic v2 | Request/response validation |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Vite | Frontend build tool + dev proxy |

---

## 📁 Project Structure

```
getmeplaced/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── core/
│   │   ├── config.py            # Settings & env vars
│   │   ├── database.py          # MongoDB connection
│   │   └── security.py          # JWT + password hashing
│   ├── models/
│   │   ├── user.py
│   │   ├── question.py
│   │   └── session.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── question.py
│   │   └── session.py
│   ├── routers/
│   │   ├── auth.py              # Login / Register
│   │   ├── questions.py         # Company-wise Q&A
│   │   ├── mock_interview.py    # Mock interview sessions
│   │   └── dashboard.py         # Stats & progress
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── question_service.py
│   │   └── session_service.py
│   └── utils/
│       └── helpers.py
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── ui/              # Reusable UI primitives
        │   ├── layout/          # Navbar, Sidebar, Footer
        │   └── 3d/              # Three.js components
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── Dashboard.jsx
        │   ├── Companies.jsx
        │   ├── QuestionBank.jsx
        │   └── MockInterview.jsx
        ├── hooks/               # Custom React hooks
        ├── context/             # Auth context
        ├── services/            # API calls via Axios
        └── utils/               # Helpers
```

---

## 🚀 Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Fill in your MongoDB URI & JWT secret
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Features

- 🏢 **Company-wise Questions** — Browse real interview questions filtered by company, difficulty, topic
- 🤖 **Mock Interview** — AI-powered Q&A sessions with scoring and feedback
- 📊 **Dashboard** — Track your progress, streaks, weak areas, time spent
- 🔐 **Auth** — JWT-based register/login with protected routes
- 🌗 **Dark / Light Mode** — 3D-enhanced theme switcher
