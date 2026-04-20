from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.study_session import StudySession
from app.schemas.study_session import StudySessionCreate, StudySessionUpdate
from datetime import datetime, date, timedelta
from typing import Optional

class StudySessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, session_data: StudySessionCreate, user_id: int):
        db_session = StudySession(**session_data.model_dump(), user_id=user_id)
        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)
        return db_session

    def get_session_by_id(self, session_id: int, user_id: int):
        return self.db.query(StudySession).filter(
            StudySession.id == session_id,
            StudySession.user_id == user_id
        ).first()

    def update_session(self, session_id: int, session_data: StudySessionUpdate, user_id: int):
        db_session = self.get_session_by_id(session_id, user_id)
        if db_session:
            for key, value in session_data.model_dump(exclude_unset=True).items():
                setattr(db_session, key, value)
            self.db.commit()
            self.db.refresh(db_session)
        return db_session

    def get_user_sessions(self, user_id: int, limit: int = 100):
        return self.db.query(StudySession).filter(
            StudySession.user_id == user_id
        ).order_by(StudySession.start_time.desc()).limit(limit).all()

    def get_daily_stats(self, user_id: int):
        today = date.today()
        start_of_day = datetime.combine(today, datetime.min.time())
        
        # Total sessions today
        total_sessions = self.db.query(StudySession).filter(
            StudySession.user_id == user_id,
            StudySession.start_time >= start_of_day,
            StudySession.status == "completed"
        ).count()
        
        # Total duration today
        total_duration = self.db.query(func.sum(StudySession.duration)).filter(
            StudySession.user_id == user_id,
            StudySession.start_time >= start_of_day,
            StudySession.status == "completed"
        ).scalar() or 0
        
        return {
            "total_sessions": total_sessions,
            "total_focus_minutes": total_duration // 60,
            "daily_stats": [] # Can expand this later for charts
        }
