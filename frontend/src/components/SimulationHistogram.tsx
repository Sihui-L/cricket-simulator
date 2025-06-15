import { Paper, Text } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { IconChartHistogram } from "@tabler/icons-react";
import type { SimulationResults } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SimulationHistogramProps {
  results: SimulationResults;
}

export function SimulationHistogram({ results }: SimulationHistogramProps) {
  const { game_info, statistics, simulation_results } = results;
  const { total_simulations } = statistics;

  // Handle zero simulations case
  if (total_simulations === 0) {
    return (
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        className="bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="flex items-center gap-3 mb-6">
          <IconChartHistogram size={28} className="text-purple-600" />
          <Text size="xl" fw={600} className="text-gray-800">
            Score Distribution Analysis
          </Text>
        </div>
        <div className="bg-white p-12 rounded-lg border border-gray-200">
          <Text size="lg" c="dimmed" className="text-center">
            No simulation data to display
          </Text>
        </div>
      </Paper>
    );
  }

  const createHistogramData = () => {
    const homeResults = simulation_results.home_team_scores;
    const awayResults = simulation_results.away_team_scores;

    const allResults = [...homeResults, ...awayResults];
    const min = Math.min(...allResults);
    const max = Math.max(...allResults);

    const binCount = 12;
    const binWidth = (max - min) / binCount;
    const bins = [];

    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth;
      const binEnd = min + (i + 1) * binWidth;
      bins.push({
        label: `${Math.round(binStart)}-${Math.round(binEnd)}`,
        range: [binStart, binEnd],
      });
    }

    const homeCounts = new Array(binCount).fill(0);
    const awayCounts = new Array(binCount).fill(0);

    homeResults.forEach((result) => {
      const binIndex = Math.min(
        Math.floor((result - min) / binWidth),
        binCount - 1
      );
      homeCounts[binIndex]++;
    });

    awayResults.forEach((result) => {
      const binIndex = Math.min(
        Math.floor((result - min) / binWidth),
        binCount - 1
      );
      awayCounts[binIndex]++;
    });

    return {
      labels: bins.map((bin) => bin.label),
      datasets: [
        {
          label: game_info.home_team.name,
          data: homeCounts,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: game_info.away_team.name,
          data: awayCounts,
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (context) => `Score Range: ${context[0].label}`,
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y} simulations`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Score Range",
          font: {
            size: 14,
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Simulations",
          font: {
            size: 14,
            weight: 600,
          },
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const data = createHistogramData();

  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      className="bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <div className="flex items-center gap-3 mb-6">
        <IconChartHistogram size={28} className="text-purple-600" />
        <Text size="xl" fw={600} className="text-gray-800">
          Score Distribution Analysis
        </Text>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="h-[400px]">
          <Bar data={data} options={options} />
        </div>
      </div>

      <Text size="sm" c="dimmed" className="mt-4 text-center">
        Distribution of predicted scores across all simulation runs
      </Text>
    </Paper>
  );
}
