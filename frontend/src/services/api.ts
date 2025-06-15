import axios from "axios";
import type { Game, SimulationResults } from "../types";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const gameService = {
  async getAllGames(): Promise<Game[]> {
    const response = await api.get<Game[]>("/games");
    return response.data;
  },

  async getGameSimulations(gameId: number): Promise<SimulationResults> {
    const response = await api.get<SimulationResults>(`/simulations/${gameId}`);
    return response.data;
  },
};
