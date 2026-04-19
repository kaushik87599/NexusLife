from fastapi import HTTPException, status
from app.repositories.note_repository import NoteRepository
from app.schemas.note import NoteCreate, NoteUpdate
from typing import List

class NoteService:
    def __init__(self, repository: NoteRepository):
        self.repository = repository

    def create_note(self, note_data: NoteCreate, user_id: int):
        return self.repository.create_note(note_data, user_id)

    def get_notes(self, user_id: int):
        return self.repository.get_notes_by_user(user_id)

    def get_note(self, note_id: int, user_id: int):
        note = self.repository.get_note_by_id(note_id, user_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )
        return note

    def update_note(self, note_id: int, note_data: NoteUpdate, user_id: int):
        note = self.repository.update_note(note_id, note_data, user_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )
        return note

    def delete_note(self, note_id: int, user_id: int):
        success = self.repository.delete_note(note_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Note not found"
            )
        return {"status": "success", "message": "Note deleted"}
