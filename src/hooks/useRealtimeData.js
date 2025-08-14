import { useState, useEffect, useCallback } from 'react';
import { initializeRealtime, onTableUpdate, cleanupRealtime } from '../utils/realtime';
import { getUsers, getTasks, getPenaltySummary } from '../utils/database';

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
      console.error('Error loading initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle real-time updates
  useEffect(() => {
    // Initialize real-time subscriptions
    initializeRealtime();

    // Load initial data
    loadInitialData();

    // Set up real-time listeners
    const unsubscribeUsers = onTableUpdate('users', async (payload) => {
      console.log('Users updated via real-time:', payload);
      // Reload users data
      try {
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
      } catch (err) {
        console.error('Error updating users:', err);
      }
    });

    const unsubscribeTasks = onTableUpdate('tasks', async (payload) => {
      console.log('Tasks updated via real-time:', payload);
      // Reload tasks data
      try {
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);
      } catch (err) {
        console.error('Error updating tasks:', err);
      }
    });

    const unsubscribePenalties = onTableUpdate('penalties', async (payload) => {
      console.log('Penalties updated via real-time:', payload);
      // Reload penalties data
      try {
        const updatedPenalties = await getPenaltySummary();
        setPenalties(updatedPenalties);
      } catch (err) {
        console.error('Error updating penalties:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
      unsubscribePenalties();
      cleanupRealtime();
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
