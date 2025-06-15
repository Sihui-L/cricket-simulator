# Cricket Simulator

A full-stack web application for visualizing cricket match simulation results with interactive charts and win percentage calculations.

---

## Project Structure

```
cricket-simulator/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── database.py       # DB setup
│   │   └── data_loader.py    # Loads CSV data
│   ├── data/                 # CSV data files
│   ├── requirements.txt
│   ├── Dockerfile
├── frontend/
│   ├── src/                  # React source code
│   ├── public/
│   └── package.json
└── README.md
```

---

## Backend Setup

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- **OR** [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Installation (Local)

1. **Clone and navigate to the project:**

   ```bash
   git clone https://github.com/Sihui-L/cricket-simulator.git
   cd cricket-simulator/backend
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

### Running the Backend

**Option 1: Locally (with Python)**

```bash
uvicorn app.main:app --reload
```

---

**Option 2: With Docker**

```bash
docker-compose up --build
```

---

### Database

- The backend uses SQLite with a local file (`cricket_simulator.db`) that gets created automatically when you first load data.

---

### API Endpoints

- `GET /games` - List all games with venue information
- `GET /simulations/{game_id}` - Get simulation results for a specific game

---

## Frontend Setup

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd cricket-simulator/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   Make sure the backend is running on port 8000 (see Backend Setup above).

4. **Open the application:**
   - Navigate to [http://localhost:5173](http://localhost:5173) in your browser.
   - The frontend will automatically proxy API requests to the backend on port 8000.

---

## License

MIT
