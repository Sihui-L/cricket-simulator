from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Venue(Base):
    __tablename__ = "venues"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    
    # Relationship to games
    games = relationship("Game", back_populates="venue")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    
    # Relationships
    home_games = relationship("Game", foreign_keys="Game.home_team_id", back_populates="home_team")
    away_games = relationship("Game", foreign_keys="Game.away_team_id", back_populates="away_team")
    simulations = relationship("Simulation", back_populates="team")

class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    home_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    away_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    date = Column(Date, nullable=False)
    
    # Relationships
    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_games")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_games")
    venue = relationship("Venue", back_populates="games")

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    run_number = Column(Integer, nullable=False)
    result = Column(Integer, nullable=False)  # Simulation result score
    
    # Relationships
    team = relationship("Team", back_populates="simulations")