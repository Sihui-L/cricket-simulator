import { Select, Paper, Text } from "@mantine/core";
import { IconCricket } from "@tabler/icons-react";
import type { Game } from "../types";

interface GameSelectorProps {
  games: Game[];
  selectedGame: number | null;
  onGameSelect: (gameId: number | null) => void;
  loading?: boolean;
}

export function GameSelector({
  games,
  selectedGame,
  onGameSelect,
  loading,
}: GameSelectorProps) {
  const gameOptions = games.map((game) => ({
    value: game.id.toString(),
    label: `${game.home_team} vs ${game.away_team}`,
  }));

  const selectedGameData = games.find((g) => g.id === selectedGame);

  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      className="bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="flex items-center gap-3 mb-4">
        <IconCricket size={28} className="text-blue-600" />
        <Text size="xl" fw={600} className="text-gray-800">
          Select a Match
        </Text>
      </div>

      <Select
        placeholder={
          loading ? "Loading matches..." : "Choose a match to analyze"
        }
        data={gameOptions}
        value={selectedGame?.toString() || null}
        onChange={(value) => onGameSelect(value ? parseInt(value) : null)}
        disabled={loading}
        searchable
        clearable
        size="lg"
        className="mb-4"
        styles={{
          input: {
            backgroundColor: "white",
            borderColor: "#e5e7eb",
            "&:focus": { borderColor: "#3b82f6" },
          },
        }}
      />

      {selectedGameData && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Text size="xs" c="dimmed">
                Venue
              </Text>
              <Text fw={500}>{selectedGameData.venue}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Date
              </Text>
              <Text fw={500}>
                {new Date(selectedGameData.date).toLocaleDateString()}
              </Text>
            </div>
          </div>
        </div>
      )}
    </Paper>
  );
}
