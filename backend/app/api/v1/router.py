from fastapi import APIRouter
from app.api.v1.endpoints import auth, tasks, events, notes, study_sessions, reminders, notifications, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(study_sessions.router, prefix="/study-sessions", tags=["study-sessions"])
api_router.include_router(reminders.router, prefix="/reminders", tags=["reminders"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])