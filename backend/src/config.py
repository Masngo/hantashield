import os
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for easy local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hantashield.db")
