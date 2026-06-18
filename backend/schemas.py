from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime
from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str # "candidate" or "recruiter"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

class JobBase(BaseModel):
    title: str
    description: str
    required_skills: str

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    recruiter_id: int
    created_at: datetime.datetime
    is_active: bool

    class Config:
        from_attributes = True

class ResumeResponse(BaseModel):
    id: int
    candidate_id: int
    file_path: str
    extracted_text: Optional[str] = None
    
    class Config:
        from_attributes = True

class ResumeSummary(BaseModel):
    summary_text: str
    experience_summary: str
    education_summary: str
    skills_highlight: str
    key_strengths: str

class InterviewBase(BaseModel):
    scheduled_at: datetime.datetime
    meeting_link: Optional[str] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewResponse(InterviewBase):
    id: int
    application_id: int

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    job_id: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    candidate_id: int
    status: str
    match_score: float
    applied_at: datetime.datetime
    job: JobResponse
    candidate: UserResponse
    interview: Optional[InterviewResponse] = None

    class Config:
        from_attributes = True
