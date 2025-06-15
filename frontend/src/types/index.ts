export interface Game {
  id: number;
  home_team: string;
  away_team: string;
  venue: string;
  date: string;
}

export interface TeamInfo {
  id: number;
  name: string;
}

export interface GameInfo {
  id: number;
  home_team: TeamInfo;
  away_team: TeamInfo;
  venue: string;
  date: string;
}

export interface Statistics {
  total_simulations: number;
  home_team_win_percentage: number;
  away_team_win_percentage: number;
}

export interface SimulationResults {
  game_info: GameInfo;
  statistics: Statistics;
  simulation_results: {
    home_team_scores: number[];
    away_team_scores: number[];
  };
}

export interface HistogramBin {
  range: [number, number];
  home_count: number;
  away_count: number;
}
