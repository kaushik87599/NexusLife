from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session metadata
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration = Column(Integer, default=0)  # Total seconds focus time
    
    # Session type and status
    # type: work, short_break, long_break
    session_type = Column(String, default="work")
    # status: active, paused, completed, interrupted
    status = Column(String, default="active")
    
    # Optional links (future hooks)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    note_id = Column(Integer, ForeignKey("notes.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="study_sessions")
    # task = relationship("Task") # Shall link this in later session
    # note = relationship("Note") # Shall link this in later session

    __table_args__ = (
        Index("idx_study_sessions_user_id", "user_id"),
        Index("idx_study_sessions_status", "status"),
        Index("idx_study_sessions_start_time", "start_time"),
    )
