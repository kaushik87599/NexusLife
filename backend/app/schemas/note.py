from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None
    tags: Optional[str] = ""
    color: Optional[str] = "#3b82f6"
    is_pinned: bool = False

class NoteCreate(NoteBase):
    pass #because the NoteBase  captures all the required fields itself

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None
    color: Optional[str] = None
    is_pinned: Optional[bool] = None

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
