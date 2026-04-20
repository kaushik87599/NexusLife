from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    role = Column(String, default="user", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    tasks = relationship("Task", back_populates="user")
    events = relationship("Event", back_populates="user")
    notes = relationship("Note", back_populates="user")
    study_sessions = relationship("StudySession", back_populates="user")
    reminders = relationship("Reminder", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
