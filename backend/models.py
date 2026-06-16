from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String) # "candidate" or "recruiter"

    jobs = relationship("Job", back_populates="recruiter")
    applications = relationship("Application", back_populates="candidate")
    resume = relationship("Resume", back_populates="candidate", uselist=False)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    required_skills = Column(String) # Comma-separated
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

    recruiter = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id"), unique=True)
    file_path = Column(String)
    extracted_text = Column(String)

    candidate = relationship("User", back_populates="resume")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="applied") # applied, reviewing, interviewed, rejected, accepted
    match_score = Column(Float, default=0.0)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    candidate = relationship("User", back_populates="applications")
    interview = relationship("Interview", back_populates="application", uselist=False)

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True)
    scheduled_at = Column(DateTime)
    meeting_link = Column(String, nullable=True)

    application = relationship("Application", back_populates="interview")
