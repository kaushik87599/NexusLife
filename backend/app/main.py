from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(
    title="NexusLife API",
    description="Backend for the NexusLife productivity ecosystem",
    version="0.1.0"
)

@app.get("/", tags=["Health Check"])
def root():
    return {"status": "ok", "message": "Welcome to NexusLife API"}

# Include API routes
app.include_router(api_router, prefix="/api/v1")
