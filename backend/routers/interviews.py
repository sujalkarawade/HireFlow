from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/api/interviews", tags=["interviews"])

@router.post("/application/{app_id}", response_model=schemas.InterviewResponse)
def schedule_interview(app_id: int, interview: schemas.InterviewCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_recruiter)):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(models.Job).filter(models.Job.id == app.job_id, models.Job.recruiter_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=403, detail="Not authorized to schedule interview for this application")

    existing_interview = db.query(models.Interview).filter(models.Interview.application_id == app_id).first()
    if existing_interview:
        raise HTTPException(status_code=400, detail="Interview already scheduled for this application")

    db_interview = models.Interview(
        application_id=app_id,
        scheduled_at=interview.scheduled_at,
        meeting_link=interview.meeting_link
    )
    db.add(db_interview)
    
    # Also update application status
    app.status = "interviewed"
    
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.get("/my-interviews", response_model=List[schemas.InterviewResponse])
def get_my_interviews(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_candidate)):
    # Find all applications for this candidate
    apps = db.query(models.Application).filter(models.Application.candidate_id == current_user.id).all()
    app_ids = [app.id for app in apps]
    
    interviews = db.query(models.Interview).filter(models.Interview.application_id.in_(app_ids)).all()
    return interviews
