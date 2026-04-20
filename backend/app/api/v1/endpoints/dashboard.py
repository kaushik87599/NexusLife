from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.api import deps
from app.models.user import User
from app.schemas.dashboard import DashboardData
from app.repositories.task_repository import TaskRepository
from app.repositories.event_repository import EventRepository
from app.repositories.study_session_repository import StudySessionRepository
from app.repositories.notification_repository import NotificationRepository
from app.models.event import Event as EventModel
from app.models.task import Task as TaskModel

router = APIRouter()

@router.get("/", response_model=DashboardData)
def get_dashboard_data(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    task_repo = TaskRepository(db)
    event_repo = EventRepository(db)
    study_repo = StudySessionRepository(db)
    notif_repo = NotificationRepository(db)

    now = datetime.now()
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())

    # 1. Tasks: Top 5 pending, prioritizing high priority and overdue
    all_tasks = db.query(TaskModel).filter(
        TaskModel.user_id == current_user.id,
        TaskModel.status != "completed"
    ).order_by(
        TaskModel.priority.desc(),
        TaskModel.due_date.asc()
    ).limit(5).all()

    # Upcoming tasks (due in next 3 days)
    upcoming_tasks = db.query(TaskModel).filter(
        TaskModel.user_id == current_user.id,
        TaskModel.status != "completed",
        TaskModel.due_date > now,
        TaskModel.due_date <= now + timedelta(days=3)
    ).order_by(TaskModel.due_date.asc()).limit(5).all()

    # 2. Schedule: Today's events
    today_events = event_repo.get_user_events(current_user.id, start_date=today_start, end_date=today_end)
    
    # Current event
    current_event = db.query(EventModel).filter(
        EventModel.user_id == current_user.id,
        EventModel.start_time <= now,
        EventModel.end_time >= now
    ).first()

    # Next event
    next_event = db.query(EventModel).filter(
        EventModel.user_id == current_user.id,
        EventModel.start_time > now
    ).order_by(EventModel.start_time.asc()).first()

    # 3. Study Stats
    study_stats = study_repo.get_daily_stats(current_user.id)

    # 4. Notifications
    unread_notifs = notif_repo.get_unread_by_user(current_user.id)
    
    return {
        "tasks": all_tasks,
        "upcoming_tasks": upcoming_tasks,
        "schedule": today_events,
        "current_event": current_event,
        "next_event": next_event,
        "study_stats": study_stats,
        "unread_notifications": unread_notifs[:5],
        "unread_count": len(unread_notifs)
    }
