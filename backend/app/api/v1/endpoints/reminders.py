from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from app.repositories.reminder_repository import ReminderRepository
from app.services.reminder.reminder_service import ReminderService

router = APIRouter()

# Helper function to get the service instance
def get_reminder_service(db: Session = Depends(get_db)):
    repo = ReminderRepository(db)
    return ReminderService(repo)

# Create a new reminder
@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    reminder_in: ReminderCreate,
    current_user: User = Depends(get_current_user),
    service: ReminderService = Depends(get_reminder_service)
):
    return service.create_reminder(reminder_in, current_user.id)

# Get all reminders for the current user
@router.get("/", response_model=List[ReminderResponse])
def get_reminders(
    current_user: User = Depends(get_current_user),
    service: ReminderService = Depends(get_reminder_service)
):
    return service.get_reminders(current_user.id)

# Get a single reminder by ID
@router.get("/{reminder_id}", response_model=ReminderResponse)
def get_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    service: ReminderService = Depends(get_reminder_service)
):
    return service.get_reminder(reminder_id, current_user.id)

# Update a reminder
@router.put("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    reminder_in: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    service: ReminderService = Depends(get_reminder_service)
):
    return service.update_reminder(reminder_id, reminder_in, current_user.id)

# Delete a reminder
@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    service: ReminderService = Depends(get_reminder_service)
):
    service.delete_reminder(reminder_id, current_user.id)
    return None
