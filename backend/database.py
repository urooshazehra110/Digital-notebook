import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# Find the .env file inside the backend folder
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

# Load environment variables
load_dotenv(ENV_FILE)


# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL")


# Check that DATABASE_URL was found
if DATABASE_URL is None:
    raise ValueError(
        f"DATABASE_URL was not found. "
        f"Make sure your .env file exists at: {ENV_FILE}"
    )


# Create database engine
engine = create_engine(DATABASE_URL)


# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base class for database models
Base = declarative_base()


# Database dependency for FastAPI
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()