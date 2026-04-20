from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    message = Column(String, nullable=True)
    type = Column(String, default="general") # e.g., "reminder", "system"
    
    # Generic target link (could be task_id, reminder_id, etc.)
    target_type = Column(String, nullable=True)
    target_id = Column(Integer, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reminder_id = Column(Integer, ForeignKey("reminders.id", ondelete="CASCADE"), nullable=True)
    
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="notifications")
    reminder = relationship("Reminder", back_populates="notifications")