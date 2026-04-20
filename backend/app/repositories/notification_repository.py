from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate
from sqlalchemy import func

class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, obj_in: NotificationCreate, user_id: int) -> Notification:
        db_obj = Notification(
            **obj_in.model_dump(),
            user_id=user_id
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_multi_by_user(self, user_id: int):
        return self.db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    def get_unread_by_user(self, user_id: int):
        return self.db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).order_by(Notification.created_at.desc()).all()

    def mark_read(self, id: int, user_id: int) -> Notification:
        db_obj = self.db.query(Notification).filter(Notification.id == id, Notification.user_id == user_id).first()
        if db_obj:
            db_obj.is_read = True
            db_obj.read_at = func.now()
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
        return db_obj

    def mark_all_read(self, user_id: int):
        self.db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update({
            "is_read": True,
            "read_at": func.now()
        }, synchronize_session=False)
        self.db.commit()

    def remove(self, id: int, user_id: int):
        obj = self.db.query(Notification).filter(Notification.id == id, Notification.user_id == user_id).first()
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
