from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from .database import get_db
from .models import Game, Simulation, Team, Venue

router = APIRouter()

@router.get("/games")
async def get_all_games(db: Session = Depends(get_db)):
    """Get all games with venue information"""
    games = db.query(Game).join(Venue).join(Team, Game.home_team_id == Team.id).all()
    
    result = []
    for game in games:
        home_team = db.query(Team).filter(Team.id == game.home_team_id).first()
        away_team = db.query(Team).filter(Team.id == game.away_team_id).first()
        
        result.append({
            "id": game.id,
            "home_team": home_team.name,
            "away_team": away_team.name,
            "venue": game.venue.name,
            "date": game.date.isoformat(),
        })
    
    return result

@router.get("/simulations/{game_id}")
async def get_game_simulations(game_id: int, db: Session = Depends(get_db)):
    # Get the game to find out which teams are playing
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Get ALL simulation data for the home team (general performance)
    home_team_sims = db.query(Simulation).filter(
        Simulation.team_id == game.home_team_id
    ).all()
    
    # Get ALL simulation data for the away team (general performance)  
    away_team_sims = db.query(Simulation).filter(
        Simulation.team_id == game.away_team_id
    ).all()
    
    if not home_team_sims or not away_team_sims:
        raise HTTPException(status_code=404, detail="Simulation data not found for one or both teams")
    
    # Convert to lists of scores for easy comparison
    home_scores = [sim.result for sim in home_team_sims]
    away_scores = [sim.result for sim in away_team_sims]
    
    # Calculate win percentage by comparing performance distributions
    home_wins = 0
    total_comparisons = min(len(home_scores), len(away_scores))
    
    for i in range(total_comparisons):
        if home_scores[i] > away_scores[i]:
            home_wins += 1
    
    home_win_percentage = (home_wins / total_comparisons * 100) if total_comparisons > 0 else 0
    
    return {
        "game_info": {
            "id": game.id,
            "home_team": {"id": game.home_team.id, "name": game.home_team.name},
            "away_team": {"id": game.away_team.id, "name": game.away_team.name},
            "venue": game.venue.name,
            "date": game.date.strftime("%Y-%m-%d")
        },
        "statistics": {
            "total_simulations": total_comparisons,
            "home_team_win_percentage": round(home_win_percentage, 1),
            "away_team_win_percentage": round(100 - home_win_percentage, 1)
        },
        "simulation_results": {
            "home_team_scores": home_scores,
            "away_team_scores": away_scores
        }
    }