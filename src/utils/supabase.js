import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Supabase configuration
// Load from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase environment variables. Please check your .env file.');
  logger.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
  PENALTIES: 'penalties',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'settings'
};

// Helper function to handle database errors
export const handleDatabaseError = (error, operation) => {
  logger.dbError(operation, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Helper function to generate unique IDs (same as localStorage)
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
