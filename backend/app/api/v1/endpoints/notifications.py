from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationResponse
from app.repositories.notification_repository import NotificationRepository
from app.services.notification.notification_service import NotificationService

router = APIRouter()

# Helper function to get the service instance
def get_notification_service(db: Session = Depends(get_db)):
    repo = NotificationRepository(db)
    return NotificationService(repo)

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification_in: NotificationCreate,
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    return service.create_notification(notification_in, current_user.id)

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    return service.get_notifications(current_user.id)

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    return service.read_notification(notification_id, current_user.id)

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    service.delete_notification(notification_id, current_user.id)    

@router.put("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def read_all_notifications(
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    service.read_all_notifications(current_user.id)

@router.get("/unread", response_model=List[NotificationResponse])
def get_unread_notifications(
    current_user: User = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service)
):
    return service.get_unread_notifications(current_user.id)