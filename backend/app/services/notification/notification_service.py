from fastapi import HTTPException, status
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationUpdate

class NotificationService:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def create_notification(self, notification_in: NotificationCreate, user_id: int):
        return self.repo.create(notification_in, user_id)

    def get_notifications(self, user_id: int):
        return self.repo.get_multi_by_user(user_id)

    def get_unread_notifications(self, user_id: int):
        return self.repo.get_unread_by_user(user_id)

    def read_notification(self, id: int, user_id: int):
        notification = self.repo.mark_read(id, user_id)
        if not notification:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return notification

    def read_all_notifications(self, user_id: int):
        self.repo.mark_all_read(user_id)

    def delete_notification(self, id: int, user_id: int):
        notification = self.repo.remove(id, user_id)
        if not notification:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return notification
