from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: Optional[str] = None
    type: Optional[str] = "general"
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    is_read: bool = False
    read_at: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    type: Optional[str] = None
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    is_read: Optional[bool] = None
    read_at: Optional[datetime] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
