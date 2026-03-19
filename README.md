# 🚀 Smart Job Tracker

A full-stack job application tracking app built with **React** (frontend) and **Django** (backend).  
Features JWT authentication, application management, an AI-powered resume analyzer, and interview question generator.

---

## 📁 Project Structure

```
smart-job-tracker/
├── backend/                    # Django REST API
│   ├── jobtracker/             # Project config (settings, urls, wsgi)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/                  # Auth app (register, login, profile)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── jobs/                   # Job applications + AI features
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py            # Includes mock AI logic
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                   # React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  # JWT auth state (login/register/logout)
    │   ├── utils/
    │   │   └── api.js           # Axios instance + auto token refresh
    │   ├── components/
    │   │   ├── AppLayout.jsx    # Protected route wrapper + layout
    │   │   ├── Sidebar.jsx      # Collapsible navigation
    │   │   ├── StatusBadge.jsx  # Color-coded status pill
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx   # Stats cards + pie chart + activity
    │   │   ├── JobsPage.jsx        # Full table with filter/search/edit
    │   │   ├── AddJobPage.jsx      # Form to add a new application
    │   │   ├── ResumePage.jsx      # AI resume feedback
    │   │   └── InterviewPage.jsx   # AI interview questions
    │   ├── App.jsx              # Router + route definitions
    │   └── index.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Backend Setup (Django)

### 1. Create & activate a virtual environment

```bash
cd backend
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. (Optional) Create a superuser for Django Admin

```bash
python manage.py createsuperuser
```

### 5. Start the development server

```bash
python manage.py runserver
# → API available at http://localhost:8000
```

---

## 🎨 Frontend Setup (React)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the dev server

```bash
npm start
# → App available at http://localhost:3000
```

> The `package.json` includes `"proxy": "http://localhost:8000"` so API calls work without CORS issues in development.

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register/` | Create account | Public |
| POST | `/api/users/login/` | Get JWT tokens | Public |
| POST | `/api/users/token/refresh/` | Refresh access token | Public |
| GET | `/api/users/profile/` | Get current user | ✅ |
| GET/POST | `/api/jobs/applications/` | List / create applications | ✅ |
| GET/PUT/PATCH/DELETE | `/api/jobs/applications/{id}/` | Single application CRUD | ✅ |
| GET | `/api/jobs/dashboard/` | Stats + recent activity | ✅ |
| POST | `/api/jobs/resume-feedback/` | AI resume analysis | ✅ |
| POST | `/api/jobs/interview-questions/` | Generate interview Qs | ✅ |

---

## ✨ Features

### 🔐 Authentication
- Register with username, email, first/last name
- Login with username + password
- JWT stored in `localStorage`; auto-refreshes on expiry
- All protected routes redirect to `/login` if unauthenticated

### 📋 Job Applications
- Add applications with company, role, status, date, location, salary, URL, notes
- Filter by status (applied / interview / offer / selected / rejected / withdrawn)
- Search by company or role
- Click any status badge to inline-edit it
- Delete applications with confirmation

### 📊 Dashboard
- Stats grid: Total, Applied, Interview, Offer, Selected, Rejected
- Interactive donut chart showing application breakdown (Recharts)
- Radial success-rate gauge
- Recent applications feed

### 🤖 Resume AI (Mock)
- Paste resume text + specify target role
- Returns overall score (0–100) and 5 categories:
  - Impact · Keywords · Formatting · Action Verbs · Summary
- Each category has a score bar, severity badge (high/medium/low), and actionable tip

### 🎙️ Interview Prep (Mock)
- Enter any job role or click a quick-select chip
- Generates 8 mixed questions (4 role-specific + 4 general)
- Click **▼ practice** under any question to open a text box for STAR answers
- Includes roles: Software, Data, Marketing, Design, Finance, General

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios (with interceptors) |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| CORS | `django-cors-headers` |
| Database | SQLite (dev) — swap to PostgreSQL for production |

---

## 🚀 Production Tips

1. **Change `SECRET_KEY`** in `settings.py` to a random 50+ char string
2. Set `DEBUG = False` and configure `ALLOWED_HOSTS`
3. Swap SQLite → PostgreSQL (`pip install psycopg2-binary`)
4. Run `npm run build` and serve the `build/` folder via Nginx or WhiteNoise
5. Use environment variables (`.env`) for all secrets

---

## 📄 License

MIT — free to use and modify.
