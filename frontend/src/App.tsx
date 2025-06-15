import { useState, useEffect } from "react";
import { Container, Title, Text, Loader, Center } from "@mantine/core";
import { IconCricket } from "@tabler/icons-react";
import { gameService } from "./services/api";
import { GameSelector } from "./components/GameSelector";
import { WinPercentageDisplay } from "./components/WinPercentageDisplay";
import { SimulationHistogram } from "./components/SimulationHistogram";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { ErrorDisplay } from "./components/ErrorDisplay";
import type { Game, SimulationResults } from "./types";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [simulationResults, setSimulationResults] =
    useState<SimulationResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      loadSimulations(selectedGame);
    } else {
      setSimulationResults(null);
    }
  }, [selectedGame]);

  const loadGames = async () => {
    try {
      setLoadingGames(true);
      setError(null);
      const gamesData = await gameService.getAllGames();
      setGames(gamesData);
    } catch (err) {
      setError("Failed to load games. Please try again.");
      console.error("Error loading games:", err);
    } finally {
      setLoadingGames(false);
    }
  };

  const loadSimulations = async (gameId: number) => {
    try {
      setLoading(true);
      setError(null);
      const results = await gameService.getGameSimulations(gameId);
      setSimulationResults(results);
    } catch (err) {
      setError("Failed to load simulation results. Please try again.");
      console.error("Error loading simulations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Container size="xl" className="py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconCricket size={40} className="text-blue-600" />
            <Title order={1} className="text-4xl font-bold text-gray-800">
              Cricket Match Simulator
            </Title>
          </div>
          <Text size="lg" c="dimmed">
            Analyze match outcomes with advanced statistical simulations
          </Text>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay
              message={error}
              onRetry={
                selectedGame ? () => loadSimulations(selectedGame) : loadGames
              }
            />
          </div>
        )}

        {/* Game Selector */}
        {loadingGames ? (
          <Center className="py-12">
            <Loader size="lg" variant="dots" />
          </Center>
        ) : (
          <div className="mb-8">
            <GameSelector
              games={games}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              loading={loadingGames}
            />
          </div>
        )}

        {/* Results Display */}
        {loading ? (
          <LoadingSkeleton />
        ) : simulationResults ? (
          <div className="space-y-8">
            <WinPercentageDisplay results={simulationResults} />
            <SimulationHistogram results={simulationResults} />
          </div>
        ) : selectedGame === null && !loadingGames ? (
          <Center className="py-20">
            <Text size="lg" c="dimmed" className="text-center">
              Select a match to view simulation results
            </Text>
          </Center>
        ) : null}
      </Container>
    </div>
  );
}

export default App;
