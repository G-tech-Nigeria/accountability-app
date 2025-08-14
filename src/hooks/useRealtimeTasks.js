import { useState, useEffect, useCallback } from 'react';
import { initializeRealtime, onTableUpdate, cleanupRealtime } from '../utils/realtime';
import { getUsers, getTasks, getDatesWithTasks } from '../utils/database';

// Custom hook for real-time tasks data
export const useRealtimeTasks = (selectedDate) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, tasksData, datesData] = await Promise.all([
        getUsers(),
        getTasks(),
        getDatesWithTasks()
      ]);
      
      setUsers(usersData);
      setTasks(tasksData);
      setAvailableDates(datesData);
      setError(null);
    } catch (err) {
      console.error('Error loading initial tasks data:', err);
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
      try {
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
      } catch (err) {
        console.error('Error updating users:', err);
      }
    });

    const unsubscribeTasks = onTableUpdate('tasks', async (payload) => {
      console.log('Tasks updated via real-time:', payload);
      try {
        const [updatedTasks, updatedDates] = await Promise.all([
          getTasks(),
          getDatesWithTasks()
        ]);
        setTasks(updatedTasks);
        setAvailableDates(updatedDates);
      } catch (err) {
        console.error('Error updating tasks:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
      cleanupRealtime();
    };
  }, [loadInitialData]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  // Get filtered tasks for selected date
  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => task.date === selectedDate);
  }, [tasks, selectedDate]);

  // Get tasks for specific user
  const getTasksForUser = useCallback((userId) => {
    return getFilteredTasks().filter(task => task.userId === userId);
  }, [getFilteredTasks]);

  // Get task count for user
  const getTaskCount = useCallback((userId) => {
    return getTasksForUser(userId).length;
  }, [getTasksForUser]);

  return {
    users,
    tasks: getFilteredTasks(),
    allTasks: tasks,
    availableDates,
    loading,
    error,
    refreshData,
    getTasksForUser,
    getTaskCount
  };
};
