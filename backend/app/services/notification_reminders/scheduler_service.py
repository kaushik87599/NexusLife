from app.core.database import sessionLocal
from app.models.reminder import Reminder
from app.models.notification import Notification
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def check_due_reminders():
    """
    Background task to check for due reminders and create notifications.
    Uses a fresh database session for each execution.
    """
    db = sessionLocal()
    try:
        now = datetime.now()
        # Query all reminders where trigger_time <= current_time AND is_triggered == False
        reminders = db.query(Reminder).filter(
            Reminder.trigger_time <= now,
            Reminder.is_triggered == False
        ).all()
        
        for reminder in reminders:
            try:
                # Create a Notification for the user
                notification = Notification(
                    user_id=reminder.user_id,
                    reminder_id=reminder.id,
                    title="Reminder: {}".format(reminder.title),
                    message=reminder.description or "You have a reminder scheduled for now.",
                    type="reminder",
                    target_type="reminder",
                    target_id=reminder.id
                )
                db.add(notification)
                
                # Mark reminder as triggered
                reminder.is_triggered = True
                
                logger.info(f"Triggered reminder: {reminder.title} for user {reminder.user_id}")
            except Exception as e:
                logger.error(f"Error processing reminder {reminder.id}: {e}")
                continue
        
        db.commit()
    except Exception as e:
        logger.error(f"Error in scheduler job: {e}")
        db.rollback()
    finally:
        db.close()
