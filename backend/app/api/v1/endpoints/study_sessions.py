from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.study_session import StudySession, StudySessionCreate, StudySessionUpdate, StudySessionStats
from app.repositories.study_session_repository import StudySessionRepository
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=StudySession)
def create_study_session(
    *,
    db: Session = Depends(deps.get_db),
    session_in: StudySessionCreate,
    current_user: User = Depends(deps.get_current_user)
):
    repo = StudySessionRepository(db)
    return repo.create_session(session_in, current_user.id)

@router.patch("/{id}", response_model=StudySession)
def update_study_session(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    session_in: StudySessionUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    repo = StudySessionRepository(db)
    session = repo.update_session(id, session_in, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/", response_model=list[StudySession])
def read_study_sessions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    repo = StudySessionRepository(db)
    return repo.get_user_sessions(current_user.id)

@router.get("/stats", response_model=StudySessionStats)
def read_study_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    repo = StudySessionRepository(db)
    return repo.get_daily_stats(current_user.id)
