import { useState, useEffect, useCallback } from 'react';
import { fetchContractEvents } from '../services/activity';
import type { ActivityEvent } from '../services/activity';

export function useActivity(escrowId?: string, pollIntervalMs: number = 10000) {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivities();
    
    // Auto-polling for real-time updates
    const interval = setInterval(() => {
      fetchActivities(true);
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [fetchActivities, pollIntervalMs]);

  return { activities, isLoading, error, refetch: fetchActivities };
}
