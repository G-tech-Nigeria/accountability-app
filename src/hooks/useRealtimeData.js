import { useState, useEffect, useCallback } from 'react';
import { onTableUpdate } from '../utils/realtime';
import { getUsers, getTasks, getPenaltySummary } from '../utils/database';
import { logger } from '../utils/logger';

// Custom hook for real-time data management
export const useRealtimeData = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [penalties, setPenalties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, tasksData, penaltiesData] = await Promise.all([
        getUsers(),
        getTasks(),
        getPenaltySummary()
      ]);
      
      setUsers(usersData);
      setTasks(tasksData);
      setPenalties(penaltiesData);
      setError(null);
    } catch (err) {
      logger.error('Error loading initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle real-time updates
  useEffect(() => {
    // Load initial data
    loadInitialData();

    // Set up real-time listeners for component-specific updates
    const unsubscribeUsers = onTableUpdate('users', async (payload) => {
      // Reload users data
      try {
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
      } catch (err) {
        logger.error('Error updating users:', err);
      }
    });

    const unsubscribeTasks = onTableUpdate('tasks', async (payload) => {
      // Reload tasks data
      try {
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);
      } catch (err) {
        logger.error('Error updating tasks:', err);
      }
    });

    const unsubscribePenalties = onTableUpdate('penalties', async (payload) => {
      // Reload penalties data
      try {
        const updatedPenalties = await getPenaltySummary();
        setPenalties(updatedPenalties);
      } catch (err) {
        logger.error('Error updating penalties:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
      unsubscribePenalties();
    };
  }, [loadInitialData]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  return {
    users,
    tasks,
    penalties,
    loading,
    error,
    refreshData
  };
};
