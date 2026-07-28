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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [escrowId]);

  useEffect(() => {
    fetchActivities();
    
    // Auto-polling for real-time updates
    const interval = setInterval(() => {
      fetchActivities(true);
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [fetchActivities, pollIntervalMs]);

  return { activities, isLoading, error, refetch: fetchActivities };
}
