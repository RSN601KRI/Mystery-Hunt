import { useCallback, useEffect, useState } from 'react';
import type { InitResponse, IncrementResponse, DecrementResponse } from '../../shared/types/api';

interface CounterState {
  count: number;
  username: string | null;
  loading: boolean;
  history: number[];
  lastAction: string | null;
}

export const useCounter = () => {
  const [state, setState] = useState<CounterState>({
    count: 0,
    username: null,
    loading: true,
    history: [],
    lastAction: null,
  });
  const [postId, setPostId] = useState<string | null>(null);

  // Check if we're running locally (no Reddit context)
  const isLocalDev = window.location.hostname === 'localhost';

  // fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        if (isLocalDev) {
          // Local development mode - use mock data
          setState({ 
            count: 0, 
            username: 'Local Developer', 
            loading: false,
            history: [0],
            lastAction: null
          });
          setPostId('local-dev');
          return;
        }

        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        setState({ 
          count: data.count, 
          username: data.username, 
          loading: false,
          history: [data.count],
          lastAction: null
        });
        setPostId(data.postId);
      } catch (err) {
        console.error('Failed to init counter', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    void init();
  }, [isLocalDev]);

  const update = useCallback(
    async (action: 'increment' | 'decrement' | 'reset') => {
      if (isLocalDev) {
        // Local development mode - update state directly
        setState((prev) => {
          let newCount = prev.count;
          if (action === 'increment') newCount += 1;
          else if (action === 'decrement') newCount -= 1;
          else if (action === 'reset') newCount = 0;
          
          return {
            ...prev,
            count: newCount,
            history: [...prev.history, newCount].slice(-10),
            lastAction: action
          };
        });
        return;
      }

      if (!postId) {
        console.error('No postId – cannot update counter');
        return;
      }
      try {
        const endpoint = action === 'reset' ? '/api/reset' : `/api/${action}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: IncrementResponse | DecrementResponse = await res.json();
        
        setState((prev) => ({ 
          ...prev, 
          count: data.count,
          history: [...prev.history, data.count].slice(-10),
          lastAction: action
        }));
      } catch (err) {
        console.error(`Failed to ${action}`, err);
      }
    },
    [postId, isLocalDev]
  );

  const increment = useCallback(() => update('increment'), [update]);
  const decrement = useCallback(() => update('decrement'), [update]);
  const reset = useCallback(() => update('reset'), [update]);

  // Add quick increment/decrement functions
  const quickIncrement = useCallback(() => {
    if (isLocalDev) {
      // Local mode - increment by 5 directly
      setState((prev) => ({
        ...prev,
        count: prev.count + 5,
        history: [...prev.history, prev.count + 5].slice(-10),
        lastAction: 'increment'
      }));
      return;
    }
    for (let i = 0; i < 5; i++) {
      setTimeout(() => increment(), i * 100);
    }
  }, [increment, isLocalDev]);

  const quickDecrement = useCallback(() => {
    if (isLocalDev) {
      // Local mode - decrement by 5 directly
      setState((prev) => ({
        ...prev,
        count: prev.count - 5,
        history: [...prev.history, prev.count - 5].slice(-10),
        lastAction: 'decrement'
      }));
      return;
    }
    for (let i = 0; i < 5; i++) {
      setTimeout(() => decrement(), i * 100);
    }
  }, [decrement, isLocalDev]);

  return {
    ...state,
    increment,
    decrement,
    reset,
    quickIncrement,
    quickDecrement,
  } as const;
};