from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class StudySessionBase(BaseModel):
    session_type: str = "work"
    task_id: Optional[int] = None
    note_id: Optional[int] = None

class StudySessionCreate(StudySessionBase):
    pass

class StudySessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    status: Optional[str] = None

class StudySession(StudySessionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: int
    status: str

class StudySessionStats(BaseModel):
    total_sessions: int
    total_focus_minutes: int
    daily_stats: list[dict]
