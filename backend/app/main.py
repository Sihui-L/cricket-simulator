from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .data_loader import DataLoader
from .routes import router

# Create FastAPI app
app = FastAPI(
    title="Cricket Simulator API",
    description="API for cricket match simulation results",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables and load data on startup
@app.on_event("startup")
async def startup_event():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Load initial data
    try:
        loader = DataLoader()
        loader.load_all_data()
    except Exception as e:
        print(f"Error during startup: {e}")

# Include routes
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Cricket Simulator API is running!"}