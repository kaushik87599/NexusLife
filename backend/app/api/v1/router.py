from fastapi import APIRouter
from app.api.v1.endpoints import auth, tasks, events, notes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])