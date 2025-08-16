import { supabase, TABLES, handleDatabaseError, generateUniqueId } from './supabase';

// Global lock to prevent concurrent penalty calculations
let penaltyCalculationLock = false;

// Users
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'get users');
    return [];
  }
};

export const saveUsers = async (users) => {
  try {
    // First, delete all existing users
    const { error: deleteError } = await supabase
      .from(TABLES.USERS)
      .delete()
      .neq('id', '0'); // Delete all records

    if (deleteError) throw deleteError;

    // Then insert all users
    if (users.length > 0) {
      const { error: insertError } = await supabase
        .from(TABLES.USERS)
        .insert(users);

      if (insertError) throw insertError;
    }
  } catch (error) {
    handleDatabaseError(error, 'save users');
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    handleDatabaseError(error, 'update user');
    return null;
  }
};

// Tasks
export const getTasks = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Transform snake_case to camelCase for app compatibility
    const transformedData = (data || []).map(task => ({
      ...task,
      userId: task.user_id
    }));
    
    return transformedData;
  } catch (error) {
    handleDatabaseError(error, 'get tasks');
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    // First, delete all existing tasks
    const { error: deleteError } = await supabase
      .from(TABLES.TASKS)
      .delete()
      .neq('id', '0'); // Delete all records

    if (deleteError) throw deleteError;

    // Then insert all tasks
    if (tasks.length > 0) {
      const { error: insertError } = await supabase
        .from(TABLES.TASKS)
        .insert(tasks);

      if (insertError) throw insertError;
    }
  } catch (error) {
    handleDatabaseError(error, 'save tasks');
  }
};

export const getTasksForDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Transform snake_case to camelCase for app compatibility
    const transformedData = (data || []).map(task => ({
      ...task,
      userId: task.user_id
    }));
    
    return transformedData;
  } catch (error) {
    handleDatabaseError(error, 'get tasks for date');
    return [];
  }
};

export const addTask = async (task) => {
  try {
    // Transform camelCase to snake_case for database
    const newTask = {
      id: generateUniqueId(),
      user_id: task.userId || task.user_id,
      title: task.title,
      description: task.description || '',
      date: task.date,
      time: task.time,
      status: task.status || 'pending',
      proof: task.proof,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .insert(newTask)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    handleDatabaseError(error, 'add task');
    return null;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    // Transform camelCase to snake_case for database
    const dbUpdates = {
      ...updates,
      user_id: updates.userId || updates.user_id,
      updated_at: new Date().toISOString()
    };
    
    // Remove camelCase fields that shouldn't go to database
    delete dbUpdates.userId;

    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update(dbUpdates)
      .eq('id', taskId)
      .select();

    if (error) throw error;
    
    // Transform back to camelCase for app
    const result = data[0];
    return {
      ...result,
      userId: result.user_id
    };
  } catch (error) {
    handleDatabaseError(error, 'update task');
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const { error } = await supabase
      .from(TABLES.TASKS)
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleDatabaseError(error, 'delete task');
    return false;
  }
};

// Penalties
export const getPenalties = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PENALTIES)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'get penalties');
    return [];
  }
};

export const savePenalties = async (penalties) => {
  try {
    // First, delete all existing penalties
    const { error: deleteError } = await supabase
      .from(TABLES.PENALTIES)
      .delete()
      .neq('id', '0'); // Delete all records

    if (deleteError) throw deleteError;

    // Then insert all penalties
    if (penalties.length > 0) {
      const { error: insertError } = await supabase
        .from(TABLES.PENALTIES)
        .insert(penalties);

      if (insertError) throw insertError;
    }
  } catch (error) {
    handleDatabaseError(error, 'save penalties');
  }
};

export const addPenalty = async (penalty) => {
  try {
    const newPenalty = {
      ...penalty,
      id: generateUniqueId(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(TABLES.PENALTIES)
      .insert(newPenalty)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    handleDatabaseError(error, 'add penalty');
    return null;
  }
};

export const deletePenalty = async (penaltyId) => {
  try {
    const { error } = await supabase
      .from(TABLES.PENALTIES)
      .delete()
      .eq('id', penaltyId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleDatabaseError(error, 'delete penalty');
    return false;
  }
};

export const getPenaltySummary = async () => {
  try {
    const penalties = await getPenalties();
    const users = await getUsers();
    const summary = {};

    users.forEach(user => {
      const owed = penalties
        .filter(p => p.from_user_id === user.id && p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const owedTo = penalties
        .filter(p => p.to_user_id === user.id && p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      summary[user.id] = {
        owed,
        owedTo,
        total: owed // Individual user's total penalties
      };
    });

    return summary;
  } catch (error) {
    handleDatabaseError(error, 'get penalty summary');
    return {};
  }
};

export const calculateMissedTaskPenalties = async (date) => {
  // Prevent concurrent penalty calculations
      if (penaltyCalculationLock) {
      return [];
    }
  
  penaltyCalculationLock = true;
  
  try {
    const tasks = await getTasks();
    const users = await getUsers();
    const settings = await getSettings();
    const penalties = await getPenalties();
    const penaltyAmount = settings.penalty_amount || 5;
    
    // Get tasks for the specified date
    const dateTasks = tasks.filter(task => task.date === date);
    
    // Group tasks by user
    const userTasks = {};
    dateTasks.forEach(task => {
      if (!userTasks[task.userId]) {
        userTasks[task.userId] = [];
      }
      userTasks[task.userId].push(task);
    });
    
    // Calculate penalties for each user
    const newPenalties = [];
    
    Object.keys(userTasks).forEach(userId => {
      // Validate that the user exists before creating penalties
      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        // User not found, skipping penalty calculation
        return;
      }
      
      const userTaskList = userTasks[userId];
      const missedTasks = userTaskList.filter(task => task.status === 'pending' || task.status === 'missed');
      
      if (missedTasks.length > 0) {
        // Calculate total penalty for this user's missed tasks
        const totalPenalty = missedTasks.length * penaltyAmount;
        
        // Improved duplicate check - check for any penalty for this user and date
        const existingPenalty = penalties.find(p => 
          p.from_user_id === userId && 
          p.date === date
        );
        
        if (!existingPenalty) {
          newPenalties.push({
            from_user_id: userId,
            to_user_id: null, // No specific recipient - this is a general penalty
            amount: totalPenalty,
            reason: `Missed tasks on ${date}: ${missedTasks.map(t => t.title).join(', ')}`,
            date: date,
            status: 'pending',
            created_at: new Date().toISOString()
          });
        }
      }
    });
    
    // Add new penalties to storage
    if (newPenalties.length > 0) {
      for (const penalty of newPenalties) {
        await addPenalty(penalty);
      }
    }
    
    return newPenalties;
  } catch (error) {
    handleDatabaseError(error, 'calculate missed task penalties');
    return [];
  } finally {
    // Always release the lock
    penaltyCalculationLock = false;
  }
};

export const getTasksForDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    
    // The database already uses camelCase, so no transformation needed
    return data || [];
  } catch (error) {
    handleDatabaseError(error, 'get tasks for date range');
    return [];
  }
};

export const cleanupDuplicatePenalties = async () => {
  try {
    const penalties = await getPenalties();
    
    // Group penalties by user and date
    const penaltyGroups = {};
    penalties.forEach(penalty => {
      const key = `${penalty.from_user_id}-${penalty.date}`;
      if (!penaltyGroups[key]) {
        penaltyGroups[key] = [];
      }
      penaltyGroups[key].push(penalty);
    });
    
    // Find and remove duplicates
    let removedCount = 0;
    for (const [key, penaltyList] of Object.entries(penaltyGroups)) {
      if (penaltyList.length > 1) {
        // Keep the first one, remove the rest
        const [keep, ...remove] = penaltyList;
        
        for (const penaltyToRemove of remove) {
          await deletePenalty(penaltyToRemove.id);
          removedCount++;
        }
      }
    }
    
    return removedCount;
  } catch (error) {
    handleDatabaseError(error, 'cleanup duplicate penalties');
    return 0;
  }
};

// Image Storage Functions
export const uploadProofImage = async (file, taskId) => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${taskId}_${Date.now()}.${fileExt}`;
    
    // Upload file to Supabase Storage (just the filename, not the full path)
    const { data, error } = await supabase.storage
      .from('proof-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('proof-images')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (error) {
    handleDatabaseError(error, 'upload proof image');
    throw error;
  }
};

export const deleteProofImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // Delete file from Supabase Storage (just the filename)
    const { error } = await supabase.storage
      .from('proof-images')
      .remove([fileName]);
    
    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, 'delete proof image');
  }
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a base64 string, return as is (for backward compatibility)
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  // Otherwise, assume it's a file path and get public URL
  const { data } = supabase.storage
    .from('proof-images')
    .getPublicUrl(imageUrl);
  
  return data.publicUrl;
};



export const getDatesWithTasks = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select('date')
      .order('date', { ascending: false });

    if (error) throw error;
    
    const dates = [...new Set(data.map(task => task.date))];
    return dates;
  } catch (error) {
    handleDatabaseError(error, 'get dates with tasks');
    return [];
  }
};

// Achievements
export const getAchievements = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .select('*')
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    
    // Transform snake_case to camelCase for app compatibility
    const transformedData = (data || []).map(achievement => ({
      ...achievement,
      userId: achievement.user_id,
      achievementId: achievement.achievement_id,
      unlockedAt: achievement.unlocked_at
    }));
    
    return transformedData;
  } catch (error) {
    handleDatabaseError(error, 'get achievements');
    return [];
  }
};

export const saveAchievements = async (achievements) => {
  try {
    // First, delete all existing achievements
    const { error: deleteError } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .delete()
      .neq('id', '0'); // Delete all records

    if (deleteError) throw deleteError;

    // Then insert all achievements
    if (achievements.length > 0) {
      const { error: insertError } = await supabase
        .from(TABLES.ACHIEVEMENTS)
        .insert(achievements);

      if (insertError) throw insertError;
    }
  } catch (error) {
    handleDatabaseError(error, 'save achievements');
  }
};

export const addAchievement = async (achievement) => {
  try {
    // Transform camelCase to snake_case for database
    const newAchievement = {
      id: generateUniqueId(),
      user_id: achievement.userId || achievement.user_id,
      achievement_id: achievement.achievementId || achievement.achievement_id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      points: achievement.points,
      unlocked_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(TABLES.ACHIEVEMENTS)
      .insert(newAchievement)
      .select();

    if (error) throw error;

    // Trigger achievement notification
    const users = await getUsers();
    const user = users.find(u => u.id === achievement.user_id);
    if (user) {
      // Dispatch custom event for notification
      const event = new CustomEvent('achievementUnlocked', {
        detail: {
          achievement: {
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            user: user
          },
          user: user
        }
      });
      window.dispatchEvent(event);
    }

    return data[0];
  } catch (error) {
    handleDatabaseError(error, 'add achievement');
    return null;
  }
};

// Settings
export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .select('*')
      .limit(1);

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data[0];
    } else {
      // Create default settings if none exist
      const defaultSettings = {
        penalty_amount: 5,
        points_per_task: 10,
        points_per_missed: -5,
        theme: 'dark',
        notifications: true
      };
      
      const { data: newSettings, error: insertError } = await supabase
        .from(TABLES.SETTINGS)
        .insert(defaultSettings)
        .select();

      if (insertError) throw insertError;
      return newSettings[0];
    }
  } catch (error) {
    handleDatabaseError(error, 'get settings');
    return {};
  }
};

export const saveSettings = async (settings) => {
  try {
    const { error } = await supabase
      .from(TABLES.SETTINGS)
      .upsert(settings, { onConflict: 'id' });

    if (error) throw error;
  } catch (error) {
    handleDatabaseError(error, 'save settings');
  }
};

// Data export/import
export const exportData = async () => {
  try {
    const data = {
      users: await getUsers(),
      tasks: await getTasks(),
      penalties: await getPenalties(),
      achievements: await getAchievements(),
      settings: await getSettings(),
      exported_at: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    handleDatabaseError(error, 'export data');
    return null;
  }
};

export const importData = async (data) => {
  try {
    const parsedData = JSON.parse(data);
    if (parsedData.users) await saveUsers(parsedData.users);
    if (parsedData.tasks) await saveTasks(parsedData.tasks);
    if (parsedData.penalties) await savePenalties(parsedData.penalties);
    if (parsedData.achievements) await saveAchievements(parsedData.achievements);
    if (parsedData.settings) await saveSettings(parsedData.settings);
    return true;
  } catch (error) {
    handleDatabaseError(error, 'import data');
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await supabase.from(TABLES.USERS).delete().neq('id', '0');
    await supabase.from(TABLES.TASKS).delete().neq('id', '0');
    await supabase.from(TABLES.PENALTIES).delete().neq('id', '0');
    await supabase.from(TABLES.ACHIEVEMENTS).delete().neq('id', '0');
    await supabase.from(TABLES.SETTINGS).delete().neq('id', '0');
    return true;
  } catch (error) {
    handleDatabaseError(error, 'clear all data');
    return false;
  }
};

export const resetUserProgress = async () => {
  try {
    // Get current users and reset their progress
    const users = await getUsers();
    const resetUsers = users.map(user => ({
      ...user,
      points: 0,
      streak: 0
    }));
    await saveUsers(resetUsers);

    // Clear all penalties
    await savePenalties([]);

    // Clear all achievements
    await supabase.from(TABLES.ACHIEVEMENTS).delete().neq('id', '0');

    return true;
  } catch (error) {
    handleDatabaseError(error, 'reset user progress');
    return false;
  }
};
