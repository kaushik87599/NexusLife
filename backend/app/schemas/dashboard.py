from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.task import TaskResponse
from app.schemas.event import EventResponse
from app.schemas.study_session import StudySessionStats
from app.schemas.notification import NotificationResponse

class DashboardData(BaseModel):
    tasks: List[TaskResponse]
    upcoming_tasks: List[TaskResponse]
    schedule: List[EventResponse]
    current_event: Optional[EventResponse] = None
    next_event: Optional[EventResponse] = None
    study_stats: StudySessionStats
    unread_notifications: List[NotificationResponse]
    unread_count: int

    model_config = {
        "from_attributes": True
    }
