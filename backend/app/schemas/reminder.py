from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    trigger_time: datetime


class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    trigger_time: Optional[datetime] = None
    is_triggered: Optional[bool] = None
    task_id: Optional[int] = None
    note_id: Optional[int] = None
    event_id: Optional[int] = None

class ReminderResponse(ReminderBase):
    id: int
    task_id: Optional[int] = None
    note_id: Optional[int] = None
    event_id: Optional[int] = None
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ReminderInDB(ReminderResponse):
    is_triggered: bool = False