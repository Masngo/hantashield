from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import engine, Base
from src.api import items, auth, alerts

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hantashield API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online"}

app.include_router(items.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
