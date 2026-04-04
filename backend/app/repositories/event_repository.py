from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate
from datetime import datetime
from typing import Optional

class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_event(self, event_data: EventCreate, current_user_id: int):
        db_event = Event(**event_data.model_dump(), user_id=current_user_id)
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def get_user_events(self, current_user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
        query = self.db.query(Event).filter(Event.user_id == current_user_id)
        if start_date:
            query = query.filter(Event.start_time >= start_date)
        if end_date:
            query = query.filter(Event.end_time <= end_date)
        return query.all()

    def get_event_by_id(self, event_id: int, current_user_id: int):
        return self.db.query(Event).filter(
            Event.id == event_id,
            Event.user_id == current_user_id
        ).first()

    def update_event(self, event_id: int, event_data: EventUpdate, current_user_id: int):
        db_event = self.db.query(Event).filter(
            Event.id == event_id,
            Event.user_id == current_user_id
        ).first()
        
        if db_event:
            for key, value in event_data.model_dump(exclude_unset=True).items():
                setattr(db_event, key, value)
            self.db.commit()
            self.db.refresh(db_event)
        return db_event

    def delete_event(self, event_id: int, current_user_id: int):
        db_event = self.db.query(Event).filter(
            Event.id == event_id,
            Event.user_id == current_user_id
        ).first()
        
        if db_event:
            self.db.delete(db_event)
            self.db.commit()
            return True
        return False
