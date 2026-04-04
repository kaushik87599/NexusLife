from sqlalchemy.orm import Session
from app.models.task import Task  # Your DB Model
from app.schemas.task import TaskCreate, TaskUpdate
from datetime import datetime
from typing import Optional

class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    # 1. CREATE: Attach the user_id manually here
    def create_task(self, task_data: TaskCreate, current_user_id: int):
        # Convert schema to DB model and add the user_id
        db_task = Task(**task_data.model_dump(), user_id=current_user_id)
        self.db.add(db_task)
        self.db.commit()
        self.db.refresh(db_task)
        return db_task

    # 2. READ: Always filter by user_id
    def get_user_tasks(self, current_user_id: int, status: Optional[str] = None, priority: Optional[str] = None, due_date: Optional[datetime] = None):
        query = self.db.query(Task).filter(Task.user_id == current_user_id)
        if status:
            query = query.filter(Task.status == status)
        if priority:
            query = query.filter(Task.priority == priority)
        if due_date:
            query = query.filter(Task.due_date == due_date)
        return query.all()

    def get_task_by_id(self, task_id: int, current_user_id: int):
        return self.db.query(Task).filter(
            Task.id == task_id, 
            Task.user_id == current_user_id
        ).first()

    # 3. UPDATE: Find by ID AND user_id
    def update_task(self, task_id: int, task_data: TaskUpdate, current_user_id: int):
        db_task = self.db.query(Task).filter(
            Task.id == task_id, 
            Task.user_id == current_user_id # <--- SECURITY CHECK
        ).first()
        
        if db_task:
            # Update only the fields that were provided
            for key, value in task_data.model_dump(exclude_unset=True).items():
                setattr(db_task, key, value)
            self.db.commit()
            self.db.refresh(db_task)
        return db_task

    # 4. DELETE: Find by ID AND user_id
    def delete_task(self, task_id: int, current_user_id: int):
        db_task = self.db.query(Task).filter(
            Task.id == task_id, 
            Task.user_id == current_user_id
        ).first()
        
        if db_task:
            self.db.delete(db_task)
            self.db.commit()
            return True
        return False