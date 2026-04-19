from sqlalchemy.orm import Session
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate
from typing import List, Optional

class NoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_note(self, note_data: NoteCreate, user_id: int) -> Note:
        db_note = Note(**note_data.model_dump(), user_id=user_id)
        self.db.add(db_note)
        self.db.commit()
        self.db.refresh(db_note)
        return db_note

    def get_notes_by_user(self, user_id: int) -> List[Note]:
        return self.db.query(Note).filter(Note.user_id == user_id).order_by(Note.is_pinned.desc(), Note.updated_at.desc()).all()

    def get_note_by_id(self, note_id: int, user_id: int) -> Optional[Note]:
        return self.db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()

    def update_note(self, note_id: int, note_data: NoteUpdate, user_id: int) -> Optional[Note]:
        db_note = self.get_note_by_id(note_id, user_id)
        if db_note:
            for key, value in note_data.model_dump(exclude_unset=True).items():
                setattr(db_note, key, value)
            self.db.commit()
            self.db.refresh(db_note)
            return db_note
        return None

    def delete_note(self, note_id: int, user_id: int) -> bool:
        db_note = self.get_note_by_id(note_id, user_id)
        if db_note:
            self.db.delete(db_note)
            self.db.commit()
            return True
        return False
