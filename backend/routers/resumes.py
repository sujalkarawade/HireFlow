from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import fitz  # PyMuPDF
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
    return text.lower()

@router.post("/", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_candidate)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    extracted_text = extract_text_from_pdf(file_path)

    db_resume = db.query(models.Resume).filter(models.Resume.candidate_id == current_user.id).first()
    if db_resume:
        db_resume.file_path = file_path
        db_resume.extracted_text = extracted_text
    else:
        db_resume = models.Resume(
            candidate_id=current_user.id,
            file_path=file_path,
            extracted_text=extracted_text
        )
        db.add(db_resume)

    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/me", response_model=schemas.ResumeResponse)
def get_my_resume(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_candidate)):
    resume = db.query(models.Resume).filter(models.Resume.candidate_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
