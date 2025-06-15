from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL - using SQLite with a local file
SQLALCHEMY_DATABASE_URL = "sqlite:///./cricket_simulator.db"

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Needed for SQLite with FastAPI
)

# Create SessionLocal class - each instance is a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency function to get database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()