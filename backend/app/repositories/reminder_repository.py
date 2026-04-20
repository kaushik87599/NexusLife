from sqlalchemy.orm import Session
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate

class ReminderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, obj_in: ReminderCreate, user_id: int) -> Reminder:
        db_obj = Reminder(
            **obj_in.model_dump(),
            user_id=user_id
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_multi_by_user(self, user_id: int):
        return self.db.query(Reminder).filter(Reminder.user_id == user_id).order_by(Reminder.trigger_time.asc()).all()

    def get_by_id(self, id: int, user_id: int):
        return self.db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == user_id).first()

    def update(self, db_obj: Reminder, obj_in: ReminderUpdate) -> Reminder:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def remove(self, id: int, user_id: int):
        obj = self.db.query(Reminder).filter(Reminder.id == id, Reminder.user_id == user_id).first()
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
