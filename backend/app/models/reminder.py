from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trigger_time = Column(DateTime(timezone=True), nullable=False)
    is_triggered = Column(Boolean, default=False)
    
    # Optional links
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    note_id = Column(Integer, ForeignKey("notes.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="reminders")
    notifications = relationship("Notification", back_populates="reminder", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_reminders_user_id", "user_id"),
        Index("idx_reminders_trigger_time", "trigger_time"),
    )