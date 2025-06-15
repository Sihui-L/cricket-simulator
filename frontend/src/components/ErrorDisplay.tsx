import { Alert, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={24} />}
      title="Error"
      color="red"
      variant="light"
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="subtle" color="red" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </Alert>
  );
}
