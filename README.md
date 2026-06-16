# Resume Screening & Job Portal

A full-stack web application for resume screening and job recruitment management. Built with **FastAPI** (backend) and **React + Vite** (frontend).

## Features

### For Recruiters
- **Post Jobs**: Create and manage job listings with title, description, and required skills
- **Review Applications**: View all applicants for a job posting
- **Resume Screening**: Uploaded resumes are parsed and candidates are matched against job requirements
- **Schedule Interviews**: Schedule and manage interviews with shortlisted candidates
- **Application Management**: Update application status (applied → reviewing → interviewed → rejected/accepted)

### For Candidates
- **Job Board**: Browse and search available job postings
- **Apply to Jobs**: Submit applications with resume upload
- **Resume Upload**: Upload your resume for automated parsing and skill matching
- **Track Applications**: View application status and match scores
- **Interviews**: View scheduled interviews with meeting links

### Core Functionality
- **JWT Authentication**: Secure login/registration with role-based access (candidate/recruiter)
- **Automated Matching**: AI-powered resume-to-job matching with match scores
- **Skill Extraction**: Resumes are parsed to extract skills and compare against job requirements
- **Application Workflow**: Complete recruitment pipeline from application to interview

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework for building APIs |
| **SQLAlchemy** | ORM for database management |
| **PostgreSQL** | Production-grade relational database |
| **JWT** | JSON Web Tokens for secure authentication |
| **Passlib** | Password hashing with bcrypt |
| **Pydantic** | Data validation and serialization |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library for building user interfaces |
| **Vite** | Build tool and development server |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **Lucide React** | Icon library |
| **CSS** | Styling (App.css, index.css) |

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration (PostgreSQL + SQLAlchemy)
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # JWT authentication & authorization
│   ├── routers/
│   │   ├── users.py         # User registration & login endpoints
│   │   ├── jobs.py          # Job CRUD endpoints
│   │   ├── resumes.py       # Resume upload & parsing endpoints
│   │   ├── applications.py  # Application submission & management
│   │   └── interviews.py    # Interview scheduling endpoints
│   └── uploads/             # Uploaded resume files storage
│
├── frontend/
│   ├── index.html           # HTML entry point
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Dependencies and scripts
│   ├── src/
│   │   ├── main.jsx         # React entry point
│   │   ├── App.jsx          # Root component with routing
│   │   ├── App.css          # Global styles
│   │   ├── index.css        # Base styles
│   │   ├── api.js           # Axios API client configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context provider
│   │   ├── components/
│   │   │   └── Navbar.jsx   # Navigation bar component
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # Recruiter dashboard
│   │   │   ├── JobBoard.jsx     # Candidate job search
│   │   │   ├── PostJob.jsx      # Recruiter job posting
│   │   │   ├── ApplicantReview.jsx  # Recruiter applicant review
│   │   │   ├── ApplicationTracker.jsx # Candidate application tracking
│   │   │   └── Interviews.jsx   # Interview management
│   │   └── assets/          # Static assets (images, icons)
```

## Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm** (comes with Node.js)
- **PostgreSQL** (version 14+ recommended)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd resume-screening
```

### 2. Database Setup (PostgreSQL)
1. **Install PostgreSQL** if not already installed ([download here](https://www.postgresql.org/download/)).
2. **Create a database** for the application:
   ```bash
   # Open psql shell
   psql -U postgres

   # Inside psql
   CREATE DATABASE resume_screening;
   \q
   ```
3. **Update the database URL** in `backend/database.py`:
   ```python
   # Replace the default SQLite URL with:
   SQLALCHEMY_DATABASE_URL = "postgresql://postgres:yourpassword@localhost/resume_screening"
   ```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies (includes psycopg2 for PostgreSQL)
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```
The API will be available at **http://localhost:8000**.  
API documentation (Swagger UI) is available at **http://localhost:8000/docs**.

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at **http://localhost:5173**.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register a new user (candidate/recruiter) |
| `POST` | `/api/users/login` | Login and receive JWT token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs/` | List all active jobs |
| `POST` | `/api/jobs/` | Create a new job (recruiter only) |
| `GET` | `/api/jobs/{id}` | Get job details |
| `PUT` | `/api/jobs/{id}` | Update a job (recruiter only) |
| `DELETE` | `/api/jobs/{id}` | Delete a job (recruiter only) |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resumes/upload` | Upload a resume (candidate only) |
| `GET` | `/api/resumes/me` | Get current user's resume |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/applications/` | List applications (recruiter: all, candidate: own) |
| `POST` | `/api/applications/` | Apply to a job (candidate only) |
| `GET` | `/api/applications/{id}` | Get application details |
| `PUT` | `/api/applications/{id}/status` | Update application status (recruiter only) |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/interviews/` | List interviews (recruiter: all, candidate: own) |
| `POST` | `/api/interviews/` | Schedule an interview (recruiter only) |

## Usage Guide

### As a Recruiter
1. **Register** with role "recruiter"
2. **Post Jobs** from the recruiter dashboard
3. **Review Applicants** who have applied to your jobs
4. **Check Match Scores** to see how well candidates fit the job requirements
5. **Schedule Interviews** with promising candidates
6. **Manage Applications** by updating their status through the pipeline

### As a Candidate
1. **Register** with role "candidate"
2. **Upload Your Resume** from your profile
3. **Browse the Job Board** to find relevant positions
4. **Apply to Jobs** — your resume will be automatically screened
5. **Track Your Applications** and view your match scores
6. **Check for Interview Invites** in the interviews section

## Development

### Backend API Documentation
Once the backend is running, visit **http://localhost:8000/docs** for interactive Swagger UI documentation.

### Running Tests
```bash
# Backend tests (if available)
cd backend
pytest

# Frontend linting
cd frontend
npm run lint
```

### Building for Production
```bash
cd frontend
npm run build
```
The production build will be output to the `frontend/dist/` directory.