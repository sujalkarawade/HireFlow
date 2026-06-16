from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import users, jobs, resumes, applications, interviews

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Screening & Job Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(resumes.router)
app.include_router(applications.router)
app.include_router(interviews.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Resume Screening & Job Portal API"}
