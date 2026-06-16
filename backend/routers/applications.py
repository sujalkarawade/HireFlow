from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/api/applications", tags=["applications"])

def calculate_match_score(required_skills_str: str, resume_text: str) -> float:
    if not required_skills_str or not resume_text:
        return 0.0
    
    # Split skills by comma and clean them up
    skills = [s.strip().lower() for s in required_skills_str.split(",") if s.strip()]
    if not skills:
        return 0.0

    matched_skills = 0
    for skill in skills:
        if skill in resume_text:
            matched_skills += 1
            
    return round((matched_skills / len(skills)) * 100, 2)

@router.post("/", response_model=schemas.ApplicationResponse)
def apply_to_job(app: schemas.ApplicationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_candidate)):
    job = db.query(models.Job).filter(models.Job.id == app.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_app = db.query(models.Application).filter(
        models.Application.job_id == app.job_id,
        models.Application.candidate_id == current_user.id
    ).first()
    if existing_app:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    resume = db.query(models.Resume).filter(models.Resume.candidate_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=400, detail="Please upload a resume first")

    match_score = calculate_match_score(job.required_skills, resume.extracted_text)

    db_app = models.Application(
        job_id=app.job_id,
        candidate_id=current_user.id,
        match_score=match_score
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/my-applications", response_model=List[schemas.ApplicationResponse])
def get_my_applications(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_candidate)):
    apps = db.query(models.Application).filter(models.Application.candidate_id == current_user.id).all()
    return apps

@router.get("/job/{job_id}", response_model=List[schemas.ApplicationResponse])
def get_job_applications(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_recruiter)):
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.recruiter_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not owned by you")

    apps = db.query(models.Application).filter(models.Application.job_id == job_id).all()
    return apps

@router.put("/{app_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(app_id: int, status: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_recruiter)):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(models.Job).filter(models.Job.id == app.job_id, models.Job.recruiter_id == current_user.id).first()
    if not job:
         raise HTTPException(status_code=403, detail="Not authorized to update this application")
    
    app.status = status
    db.commit()
    db.refresh(app)
    return app
