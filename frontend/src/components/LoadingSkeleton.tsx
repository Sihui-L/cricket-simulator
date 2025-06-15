import { Skeleton, Paper } from "@mantine/core";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Paper shadow="sm" p="xl" radius="md">
        <Skeleton height={200} radius="md" />
      </Paper>
      <Paper shadow="sm" p="xl" radius="md">
        <Skeleton height={400} radius="md" />
      </Paper>
    </div>
  );
}
