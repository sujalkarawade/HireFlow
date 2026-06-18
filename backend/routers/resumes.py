from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import re
import json
import fitz  # PyMuPDF
from groq import Groq
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

@router.get("/candidate/{candidate_id}", response_model=schemas.ResumeResponse)
def get_candidate_resume(candidate_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_recruiter)):
    resume = db.query(models.Resume).filter(models.Resume.candidate_id == candidate_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found for this candidate")
    return resume

SUMMARY_SYSTEM_PROMPT = """You are an expert HR resume analyst. Given a candidate's extracted resume text, generate a concise, structured summary in valid JSON format with EXACTLY these 5 keys (no markdown, no extra text):

{
  "summary_text": "2-3 sentence overall professional profile highlighting the candidate's key identity, years of experience, and top strengths.",
  "experience_summary": "2-3 bullet points summarizing work history, key roles, companies, and tenure. Extract actual job titles and company names when present.",
  "education_summary": "1-2 lines summarizing highest degree, field of study, and institution. Include GPA if mentioned.",
  "skills_highlight": "A comma-separated list of the candidate's top 10-15 technical and professional skills detected.",
  "key_strengths": "3-5 bullet points highlighting major accomplishments, leadership roles, certifications, and standout achievements."
}

Rules:
- Be specific — use actual data from the resume (names, numbers, technologies).
- If a field can't be determined, write "Not explicitly mentioned in resume."
- Keep it concise and recruiter-friendly.
- Output ONLY valid JSON. No explanations before or after."""

@router.post("/summary/{candidate_id}")
def get_resume_summary(candidate_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_recruiter)):
    resume = db.query(models.Resume).filter(models.Resume.candidate_id == candidate_id).first()
    if not resume or not resume.extracted_text:
        raise HTTPException(status_code=404, detail="Resume or extracted text not found for this candidate")

    # Truncate text if too long for Groq context window (model limit ~32K tokens)
    extracted_text = resume.extracted_text
    if len(extracted_text) > 25000:
        extracted_text = extracted_text[:25000] + "\n\n[TRUNCATED]"

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("[GROQ] ERROR: GROQ_API_KEY not set in environment")
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured on server")

        # Initialize Groq client
        groq_client = Groq(api_key=api_key)
        print(f"[GROQ] Calling llama-3.1-8b-instant... (text length: {len(extracted_text)})")

        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                {"role": "user", "content": f"Please analyze and summarize this resume:\n\n{extracted_text}"}
            ],
            temperature=0.1,
            max_tokens=1024,
        )

        response_text = completion.choices[0].message.content.strip()
        print(f"[GROQ] Response received ({len(response_text)} chars)")
        print(f"[GROQ] Preview: {response_text[:300]}")
        
        # Handle possible markdown code block wrapping
        cleaned = response_text
        if cleaned.startswith("```"):
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', cleaned)
            if json_match:
                cleaned = json_match.group(1).strip()

        summary_dict = json.loads(cleaned)
        
        return schemas.ResumeSummary(
            summary_text=summary_dict.get("summary_text", "Professional profile summary not available."),
            experience_summary=summary_dict.get("experience_summary", "Experience details not explicitly mentioned."),
            education_summary=summary_dict.get("education_summary", "Education details not explicitly mentioned."),
            skills_highlight=summary_dict.get("skills_highlight", "Skills not explicitly mentioned."),
            key_strengths=summary_dict.get("key_strengths", "Key strengths not explicitly mentioned."),
        )

    except json.JSONDecodeError as e:
        error_msg = f"Groq returned invalid JSON: {e}"
        print(f"[GROQ] {error_msg}")
        print(f"[GROQ] Raw response excerpt: {response_text[:500]}")
        raise HTTPException(status_code=500, detail=error_msg)
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Groq API error: {str(e)}"
        print(f"[GROQ] {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
