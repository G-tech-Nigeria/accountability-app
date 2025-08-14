// Migration utility to move data from localStorage to database
// This is a one-time script to migrate existing data

import { supabase } from './supabase.js';
import { generateUniqueId } from './supabase.js';

export const migrateFromLocalStorage = async () => {
  try {
    console.log('Starting migration from localStorage to database...');
    
    // Check if there's any data in localStorage
    const users = localStorage.getItem('accountability_users');
    const tasks = localStorage.getItem('accountability_tasks');
    const penalties = localStorage.getItem('accountability_penalties');
    const achievements = localStorage.getItem('accountability_achievements');
    const settings = localStorage.getItem('accountability_settings');
    
    if (!users && !tasks && !penalties && !achievements && !settings) {
      console.log('No localStorage data found to migrate.');
      return { success: true, message: 'No data to migrate' };
    }
    
    let migratedCount = 0;
    
    // Migrate users
    if (users) {
      const usersData = JSON.parse(users);
      for (const user of usersData) {
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            name: user.name,
            email: user.email,
            points: user.points || 0,
            streak: user.streak || 0,
            created_at: user.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error migrating user:', user.id, error);
        } else {
          migratedCount++;
        }
      }
    }
    
    // Migrate tasks
    if (tasks) {
      const tasksData = JSON.parse(tasks);
      for (const task of tasksData) {
        const { error } = await supabase
          .from('tasks')
          .upsert({
            id: task.id,
            user_id: task.userId,
            title: task.title,
            description: task.description || '',
            date: task.date,
            status: task.status || 'pending',
            proof: task.proof,
            created_at: task.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error migrating task:', task.id, error);
        } else {
          migratedCount++;
        }
      }
    }
    
    // Migrate penalties
    if (penalties) {
      const penaltiesData = JSON.parse(penalties);
      for (const penalty of penaltiesData) {
        const { error } = await supabase
          .from('penalties')
          .upsert({
            id: penalty.id,
            from_user_id: penalty.fromUserId,
            to_user_id: penalty.toUserId,
            amount: penalty.amount,
            reason: penalty.reason,
            date: penalty.date,
            status: penalty.status || 'pending',
            created_at: penalty.createdAt || new Date().toISOString()
          });
        
        if (error) {
          console.error('Error migrating penalty:', penalty.id, error);
        } else {
          migratedCount++;
        }
      }
    }
    
    // Migrate achievements
    if (achievements) {
      const achievementsData = JSON.parse(achievements);
      for (const achievement of achievementsData) {
        const { error } = await supabase
          .from('achievements')
          .upsert({
            id: achievement.id,
            user_id: achievement.userId,
            achievement_id: achievement.achievementId,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            unlocked_at: achievement.unlockedAt || new Date().toISOString()
          });
        
        if (error) {
          console.error('Error migrating achievement:', achievement.id, error);
        } else {
          migratedCount++;
        }
      }
    }
    
    // Migrate settings
    if (settings) {
      const settingsData = JSON.parse(settings);
      const { error } = await supabase
        .from('settings')
        .upsert({
          penalty_amount: settingsData.penaltyAmount || 5,
          points_per_task: settingsData.pointsPerTask || 10,
          points_per_missed: settingsData.pointsPerMissed || -5,
          theme: settingsData.theme || 'dark',
          notifications: settingsData.notifications !== false,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error migrating settings:', error);
      } else {
        migratedCount++;
      }
    }
    
    console.log(`Migration completed! ${migratedCount} records migrated.`);
    
    // Clear localStorage after successful migration
    localStorage.removeItem('accountability_users');
    localStorage.removeItem('accountability_tasks');
    localStorage.removeItem('accountability_penalties');
    localStorage.removeItem('accountability_achievements');
    localStorage.removeItem('accountability_settings');
    
    return { success: true, message: `Migration completed! ${migratedCount} records migrated.` };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: 'Migration failed: ' + error.message };
  }
};

// Function to check if migration is needed
export const checkMigrationNeeded = () => {
  const users = localStorage.getItem('accountability_users');
  const tasks = localStorage.getItem('accountability_tasks');
  const penalties = localStorage.getItem('accountability_penalties');
  const achievements = localStorage.getItem('accountability_achievements');
  const settings = localStorage.getItem('accountability_settings');
  
  return !!(users || tasks || penalties || achievements || settings);
};
