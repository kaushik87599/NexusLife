from fastapi import HTTPException, status
from app.repositories.event_repository import EventRepository
from app.schemas.event import EventCreate, EventUpdate


class EventService:
    def __init__(self, repository: EventRepository):
        self.repository = repository

    def create_new_event(self, event_data: EventCreate, user_id: int):
        return self.repository.create_event(event_data, user_id)

    def get_all_for_user(self, user_id: int, start_date: str = None, end_date: str = None):
        return self.repository.get_user_events(user_id, start_date=start_date, end_date=end_date)

    def get_event_for_user(self, event_id: int, user_id: int):
        event = self.repository.get_event_by_id(event_id, user_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or access denied"
            )
        return event

    def update_event_securely(self, event_id: int, event_data: EventUpdate, user_id: int):
        updated_event = self.repository.update_event(event_id, event_data, user_id)
        if not updated_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cannot update event: Event not found"
            )
        return updated_event

    def delete_event_securely(self, event_id: int, user_id: int):
        success = self.repository.delete_event(event_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cannot delete event: Event not found"
            )
        return {"message": "Event deleted successfully"}