import { useState, useEffect, useCallback } from 'react';
import { fetchContractEvents } from '../services/activity';
import type { ActivityEvent } from '../services/activity';

export function useActivity(escrowId?: string, pollIntervalMs: number = 30000) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchContractEvents(escrowId);
      setActivities(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Failed to fetch activity');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [escrowId]);

  useEffect(() => {
    // Initial fetch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivities();
    
    let interval: ReturnType<typeof setTimeout> | null = null;

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(() => {
        if (!document.hidden) {
          fetchActivities(true);
        }
      }, pollIntervalMs);
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchActivities(true); // Immediate refresh on focus
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    if (!document.hidden) {
      startPolling();
    }

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchActivities, pollIntervalMs]);

  return { activities, isLoading, error, refetch: fetchActivities };
}
