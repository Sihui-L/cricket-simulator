import { Paper, Text, Progress, Group, Badge } from "@mantine/core";
import { IconTrophy, IconChartBar } from "@tabler/icons-react";
import type { SimulationResults } from "../types";

interface WinPercentageDisplayProps {
  results: SimulationResults;
}

export function WinPercentageDisplay({ results }: WinPercentageDisplayProps) {
  const { game_info, statistics } = results;
  const {
    home_team_win_percentage,
    away_team_win_percentage,
    total_simulations,
  } = statistics;

  // Handle zero simulations case
  if (total_simulations === 0) {
    return (
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        className="bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconTrophy size={28} className="text-gray-600" />
          <Text size="xl" fw={600} className="text-gray-800">
            Match Prediction
          </Text>
        </div>
        <Text size="lg" c="dimmed" className="text-center py-8">
          No simulation data available for this match
        </Text>
      </Paper>
    );
  }

  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      className="bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <div className="flex items-center gap-3 mb-6">
        <IconTrophy size={28} className="text-green-600" />
        <Text size="xl" fw={600} className="text-gray-800">
          Match Prediction
        </Text>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="text-center p-6 bg-white rounded-lg border-2 border-blue-200">
          <Text size="sm" c="dimmed" className="mb-2">
            HOME TEAM
          </Text>
          <Text size="lg" fw={700} className="text-gray-800 mb-3">
            {game_info.home_team.name}
          </Text>
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {home_team_win_percentage}%
          </div>
          <Text size="sm" c="dimmed">
            Win Probability
          </Text>
        </div>

        <div className="text-center p-6 bg-white rounded-lg border-2 border-red-200">
          <Text size="sm" c="dimmed" className="mb-2">
            AWAY TEAM
          </Text>
          <Text size="lg" fw={700} className="text-gray-800 mb-3">
            {game_info.away_team.name}
          </Text>
          <div className="text-5xl font-bold text-red-600 mb-2">
            {away_team_win_percentage}%
          </div>
          <Text size="sm" c="dimmed">
            Win Probability
          </Text>
        </div>
      </div>

      <div className="mt-6">
        <Progress
          size="xl"
          radius="xl"
          value={home_team_win_percentage}
          color="blue"
        />
        <div className="flex justify-between mt-2 text-sm">
          <Text c="blue" fw={500}>
            {game_info.home_team.name}: {home_team_win_percentage}%
          </Text>
          <Text c="red" fw={500}>
            {game_info.away_team.name}: {away_team_win_percentage}%
          </Text>
        </div>
      </div>

      <Group justify="center" mt="md">
        <Badge
          leftSection={<IconChartBar size={16} />}
          variant="light"
          color="gray"
          size="lg"
        >
          Based on {total_simulations.toLocaleString()} simulations
        </Badge>
      </Group>
    </Paper>
  );
}
