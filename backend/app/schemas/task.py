from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# 1. The Foundation
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

# 2. For Creating (Adds requirements)
class TaskCreate(TaskBase):
    priority: str = "low"
    due_date: Optional[datetime] = None

# 3. For Updating (Everything becomes optional)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None

# 4. For Returning Data (The Database View)
class TaskResponse(TaskBase):
    id: int
    user_id: int
    status: str = "pending"
    priority: str
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    # New way to handle ORM (SQLAlchemy) in Pydantic V2
    model_config = ConfigDict(from_attributes=True)