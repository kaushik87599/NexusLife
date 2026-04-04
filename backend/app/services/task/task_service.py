from fastapi import HTTPException, status
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def create_new_task(self, task_data: TaskCreate, user_id: int):
        # Business Rule Example: Maybe users can't have more than 100 tasks?
        # existing_tasks = self.repository.get_user_tasks(user_id)
        # if len(existing_tasks) >= 100:
        #     raise HTTPException(status_code=400, detail="Task limit reached")
            
        return self.repository.create_task(task_data, user_id)

    def get_all_for_user(self, user_id: int, status: str = None, priority: str = None, due_date = None):
        return self.repository.get_user_tasks(user_id, status=status, priority=priority, due_date=due_date)

    def get_task_for_user(self, task_id: int, user_id: int):
        task = self.repository.get_task_by_id(task_id, user_id)
        if not task:
            # We raise the error HERE so the API knows what happened
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Task not found or access denied"
            )
        return task

    def update_task_securely(self, task_id: int, task_data: TaskUpdate, user_id: int):
        updated_task = self.repository.update_task(task_id, task_data, user_id)
        if not updated_task:
            # If the repo returns None, it means the ID was wrong OR it wasn't the user's task
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Cannot update task: Task not found"
            )
        return updated_task

    def delete_task_securely(self, task_id: int, user_id: int):
        success = self.repository.delete_task(task_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Cannot delete task: Task not found"
            )
        return {"message": "Task deleted successfully"}