from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.api.v1.router import api_router
from app.core.database import engine, Base
from app import models

from app.services.notification_reminders.scheduler_service import check_due_reminders

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize the scheduler
    scheduler = AsyncIOScheduler()
    
    # Add your job (uncomment and replace with your actual function)
    scheduler.add_job(check_due_reminders, 'interval', seconds=10)
    
    # Start the scheduler
    scheduler.start()
    
    yield
    
    # Shut down the scheduler gracefully during app teardown
    scheduler.shutdown()

app = FastAPI(
    title="NexusLife API",
    description="Backend for the NexusLife productivity ecosystem",
    version="0.1.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health Check"])
def root():
    return {"status": "ok", "message": "Welcome to NexusLife API"}

# Include API routes
app.include_router(api_router, prefix="/api/v1")
