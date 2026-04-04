from fastapi import APIRouter,Depends,status,Response,Request,HTTPException
from app.api.deps import get_db
from app.repositories.event_repository import EventRepository
from app.services.event.event_service import EventService
from sqlalchemy.orm import Session
from typing import List
from app.models.user import User
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.api.deps import get_current_user


router = APIRouter()


# Helper function to get the service instance
def get_event_service(db: Session = Depends(get_db),tags=["events"]):
    repo = EventRepository(db)
    return EventService(repo)

#POST / - Create a new event
@router.post("/",response_model=EventResponse,status_code=status.HTTP_201_CREATED,tags=["events"])
def create_event(
    event_in: EventCreate,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service)
):
    return service.create_new_event(event_in, current_user.id)

#GET / - List all events
@router.get("/",response_model=List[EventResponse],tags=["events"])
def get_events(
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service)
):
    return service.get_all_for_user(current_user.id)

#GET /{event_id} - Get one event
@router.get("/{event_id}",response_model=EventResponse,tags=["events"])
def get_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service)
):
    return service.get_event_for_user(event_id, current_user.id)

#PUT /{event_id} - Update an event
@router.put("/{event_id}",response_model=EventResponse,tags=["events"])
def update_event(
    event_id: int,
    event_in: EventUpdate,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service)
):
    return service.update_event_securely(event_id, event_in, current_user.id)   

#DELETE /{event_id} - Delete an event
@router.delete("/{event_id}",status_code=status.HTTP_204_NO_CONTENT,tags=["events"])
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    service: EventService = Depends(get_event_service)
):
    service.delete_event_securely(event_id, current_user.id)
    return None
    