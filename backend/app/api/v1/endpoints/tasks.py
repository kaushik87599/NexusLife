from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task.task_service import TaskService
from app.repositories.task_repository import TaskRepository
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()

# Helper function to get the service instance
def get_task_service(db: Session = Depends(get_db),tags=["tasks"]):
    repo = TaskRepository(db)
    return TaskService(repo)

# 1. POST / - Create a task
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED,tags=["tasks"])
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    return service.create_new_task(task_in, current_user.id)

# 2. GET / - List with filters
@router.get("/", response_model=List[TaskResponse],tags=["tasks"])
def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    # The service/repo will handle applying these filters
    return service.get_all_for_user(
        current_user.id, 
        status=status, 
        priority=priority, 
        due_date=due_date
    )

# 3. GET /{task_id} - Get one
@router.get("/{task_id}", response_model=TaskResponse,tags=["tasks"])
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    return service.get_task_for_user(task_id, current_user.id)

# 4. PUT /{task_id} - Update
@router.put("/{task_id}", response_model=TaskResponse,tags=["tasks"])
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    return service.update_task_securely(task_id, task_in, current_user.id)

# 5. DELETE /{task_id}
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT,tags=["tasks"])
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    service.delete_task_securely(task_id, current_user.id)
    return None