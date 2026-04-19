from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.repositories.note_repository import NoteRepository
from app.services.note.note_service import NoteService

router = APIRouter()

def get_note_service(db: Session = Depends(get_db)):
    repo = NoteRepository(db)
    return NoteService(repo)

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    return service.create_note(note_in, current_user.id)

@router.get("/", response_model=List[NoteResponse])
def get_notes(
    current_user: User = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    return service.get_notes(current_user.id)

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    return service.get_note(note_id, current_user.id)

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    return service.update_note(note_id, note_in, current_user.id)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    service: NoteService = Depends(get_note_service)
):
    service.delete_note(note_id, current_user.id)
    return None
