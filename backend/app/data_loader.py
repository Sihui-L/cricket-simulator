import pandas as pd
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Venue, Team, Game, Simulation
from app.database import SessionLocal

class DataLoader:
    def __init__(self, data_folder: str = "data"):
        self.data_folder = data_folder
    
    def load_all_data(self):
        """Load all CSV data into the database"""
        db = SessionLocal()
        try:
            if db.query(Venue).count() > 0:
                print("Data already exists, skipping load...")
                return
            
            print("Loading data from CSV files...")
            
            self._load_venues(db)
            db.commit()
            
            self._load_all_teams(db)
            db.commit()
            
            self._load_games(db)
            db.commit()
            
            self._load_simulations(db)
            db.commit()
            
            print("Data loading completed successfully!")
            
        except Exception as e:
            db.rollback()
            print(f"Error loading data: {e}")
            raise
        finally:
            db.close()
    
    def _load_venues(self, db: Session):
        """Load venues from CSV"""
        venues_file = os.path.join(self.data_folder, "venues.csv")
        df = pd.read_csv(venues_file)
        
        for _, row in df.iterrows():
            venue = Venue(id=row['venue_id'], name=row['venue_name'])
            db.add(venue)
        
        print(f"Loaded {len(df)} venues")
    
    def _load_all_teams(self, db: Session):
        """Load all unique teams from both simulations and games files"""
        sim_file = os.path.join(self.data_folder, "simulations.csv")
        sim_df = pd.read_csv(sim_file)
        sim_teams = sim_df[['team_id', 'team']].drop_duplicates()
        
        games_file = os.path.join(self.data_folder, "games.csv")
        games_df = pd.read_csv(games_file)
        game_teams = pd.concat([
            games_df[['home_team']].rename(columns={'home_team': 'team'}),
            games_df[['away_team']].rename(columns={'away_team': 'team'})
        ]).drop_duplicates()
        
        team_mapping = {}
        next_id = 0
        
        # Add simulation teams first (they have IDs)
        for _, row in sim_teams.iterrows():
            team_mapping[row['team']] = row['team_id']
            next_id = max(next_id, row['team_id'] + 1)
        
        # Add any missing game teams
        for _, row in game_teams.iterrows():
            if row['team'] not in team_mapping:
                team_mapping[row['team']] = next_id
                next_id += 1
        
        # Create team records
        for name, team_id in team_mapping.items():
            team = Team(id=team_id, name=name)
            db.add(team)
        
        print(f"Loaded {len(team_mapping)} teams")
    
    def _load_games(self, db: Session):
        """Load games from CSV"""
        games_file = os.path.join(self.data_folder, "games.csv")
        df = pd.read_csv(games_file)
        
        teams = {team.name: team.id for team in db.query(Team).all()}
        
        for _, row in df.iterrows():
            game = Game(
                home_team_id=teams[row['home_team']],
                away_team_id=teams[row['away_team']],
                venue_id=row['venue_id'],
                date=datetime.strptime(row['date'], '%Y-%m-%d').date()
            )
            db.add(game)
        
        print(f"Loaded {len(df)} games")
    
    def _load_simulations(self, db: Session):
        """Load simulations from simulations.csv"""
        simulations_file = os.path.join(self.data_folder, "simulations.csv")
        
        df = pd.read_csv(simulations_file)
        
        simulation_count = 0
        for _, row in df.iterrows():
            simulation = Simulation(
                team_id=row['team_id'],
                run_number=row['simulation_run'],
                result=row['results']
            )
            db.add(simulation)
            simulation_count += 1
        
        print(f"Loaded {simulation_count} simulation records")