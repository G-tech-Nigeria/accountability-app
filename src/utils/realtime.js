import { supabase, TABLES } from './supabase';

// Store active subscriptions
let subscriptions = {
  users: null,
  tasks: null,
  penalties: null,
  achievements: null
};

// Store callback functions for data updates
let updateCallbacks = {
  users: [],
  tasks: [],
  penalties: [],
  achievements: []
};

// Global reload callback
let globalReloadCallback = null;

// Initialize real-time subscriptions
export const initializeRealtime = () => {
  // Subscribe to users table changes
  subscriptions.users = supabase
    .channel('users_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.USERS },
      (payload) => {
        console.log('Users real-time update:', payload);
        updateCallbacks.users.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          // Show reload notification
          const event = new CustomEvent('databaseChange', {
            detail: { table: 'users', payload }
          });
          window.dispatchEvent(event);
          
          globalReloadCallback('users', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to tasks table changes
  subscriptions.tasks = supabase
    .channel('tasks_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.TASKS },
      (payload) => {
        console.log('Tasks real-time update:', payload);
        updateCallbacks.tasks.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          // Show reload notification
          const event = new CustomEvent('databaseChange', {
            detail: { table: 'tasks', payload }
          });
          window.dispatchEvent(event);
          
          globalReloadCallback('tasks', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to penalties table changes
  subscriptions.penalties = supabase
    .channel('penalties_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.PENALTIES },
      (payload) => {
        console.log('Penalties real-time update:', payload);
        updateCallbacks.penalties.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          // Show reload notification
          const event = new CustomEvent('databaseChange', {
            detail: { table: 'penalties', payload }
          });
          window.dispatchEvent(event);
          
          globalReloadCallback('penalties', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to achievements table changes
  subscriptions.achievements = supabase
    .channel('achievements_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.ACHIEVEMENTS },
      (payload) => {
        console.log('Achievements real-time update:', payload);
        updateCallbacks.achievements.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          // Show reload notification
          const event = new CustomEvent('databaseChange', {
            detail: { table: 'achievements', payload }
          });
          window.dispatchEvent(event);
          
          globalReloadCallback('achievements', payload);
        }
      }
    )
    .subscribe();

  console.log('Real-time subscriptions initialized');
};

// Register callback for specific table updates
export const onTableUpdate = (table, callback) => {
  if (updateCallbacks[table]) {
    updateCallbacks[table].push(callback);
  }
  return () => {
    // Return unsubscribe function
    if (updateCallbacks[table]) {
      updateCallbacks[table] = updateCallbacks[table].filter(cb => cb !== callback);
    }
  };
};

// Register global reload callback
export const onGlobalReload = (callback) => {
  globalReloadCallback = callback;
  return () => {
    globalReloadCallback = null;
  };
};

// Cleanup subscriptions
export const cleanupRealtime = () => {
  Object.values(subscriptions).forEach(subscription => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  });
  subscriptions = {
    users: null,
    tasks: null,
    penalties: null,
    achievements: null
  };
  updateCallbacks = {
    users: [],
    tasks: [],
    penalties: [],
    achievements: []
  };
  globalReloadCallback = null;
  console.log('Real-time subscriptions cleaned up');
};

// Get subscription status
export const getSubscriptionStatus = () => {
  return {
    users: !!subscriptions.users,
    tasks: !!subscriptions.tasks,
    penalties: !!subscriptions.penalties,
    achievements: !!subscriptions.achievements
  };
};
