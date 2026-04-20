from fastapi import HTTPException, status
from app.repositories.reminder_repository import ReminderRepository
from app.schemas.reminder import ReminderCreate, ReminderUpdate

class ReminderService:
    def __init__(self, repo: ReminderRepository):
        self.repo = repo

    def create_reminder(self, reminder_in: ReminderCreate, user_id: int):
        return self.repo.create(reminder_in, user_id)

    def get_reminders(self, user_id: int):
        return self.repo.get_multi_by_user(user_id)

    def get_reminder(self, id: int, user_id: int):
        reminder = self.repo.get_by_id(id, user_id)
        if not reminder:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
        return reminder

    def update_reminder(self, id: int, reminder_in: ReminderUpdate, user_id: int):
        db_obj = self.get_reminder(id, user_id)
        return self.repo.update(db_obj, reminder_in)

    def delete_reminder(self, id: int, user_id: int):
        reminder = self.repo.remove(id, user_id)
        if not reminder:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")
        return reminder
