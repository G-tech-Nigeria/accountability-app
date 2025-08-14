# Database Setup Guide for Accountability App

## 🗄️ Setting Up Supabase Database

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Your Credentials
1. Go to your project dashboard
2. Navigate to Settings → API
3. Copy your:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### Step 3: Set Up Environment Variables
1. Create a `.env` file in your project root:
```bash
cp env.example .env
```

2. Edit the `.env` file and add your Supabase credentials:
```bash
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

**Example:**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** The `.env` file is already in `.gitignore` to keep your credentials secure.

### Step 4: Create Database Tables
Run this SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT DEFAULT '👤',
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed')),
  proof TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Penalties table
CREATE TABLE penalties (
  id TEXT PRIMARY KEY,
  from_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  to_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  penalty_amount INTEGER DEFAULT 5,
  points_per_task INTEGER DEFAULT 10,
  points_per_missed INTEGER DEFAULT -5,
  theme TEXT DEFAULT 'dark',
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_penalties_from_user_id ON penalties(from_user_id);
CREATE INDEX idx_penalties_to_user_id ON penalties(to_user_id);
CREATE INDEX idx_penalties_date ON penalties(date);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_achievement_id ON achievements(achievement_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a local app)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on penalties" ON penalties FOR ALL USING (true);
CREATE POLICY "Allow all operations on achievements" ON achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);
```

### Step 5: Switch to Database Storage
Update your components to use the database functions instead of localStorage:

**Option A: Replace all imports**
Replace `import { ... } from '../utils/storage';` with `import { ... } from '../utils/database';`

**Option B: Create a hybrid system**
Create a storage adapter that can switch between localStorage and database.

### Step 6: Fix Missing Columns (if needed)
If you get errors about missing columns, run these SQL commands in your Supabase SQL Editor:

```sql
-- Add avatar column to existing users table
ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT '👤';

-- Add time column to existing tasks table
ALTER TABLE tasks ADD COLUMN time TEXT;

-- Add achievement_id column to existing achievements table
ALTER TABLE achievements ADD COLUMN achievement_id TEXT NOT NULL;
```

### Step 7: Test the Connection
1. Start your app: `npm run dev`
2. Check the browser console for any database connection errors
3. Try creating a user and task to verify everything works

## 🔄 Migration from localStorage

If you want to migrate existing data from localStorage to the database:

```javascript
// In your browser console or a migration script
import { exportData } from './utils/storage';
import { importData } from './utils/database';

// Export from localStorage
const localStorageData = exportData();

// Import to database
await importData(localStorageData);
```

## 📊 Database Schema Overview

### Users Table
- `id`: Unique identifier (TEXT)
- `name`: User's display name (TEXT)
- `email`: User's email (TEXT, optional)
- `points`: Total points earned (INTEGER)
- `streak`: Current streak count (INTEGER)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Tasks Table
- `id`: Unique identifier (TEXT)
- `user_id`: Reference to user (TEXT)
- `title`: Task title (TEXT)
- `description`: Task description (TEXT, optional)
- `date`: Task date (DATE)
- `status`: Task status (pending/completed/missed)
- `proof`: Proof upload URL (TEXT, optional)
- `created_at`: Task creation timestamp
- `updated_at`: Last update timestamp

### Penalties Table
- `id`: Unique identifier (TEXT)
- `from_user_id`: User who owes penalty (TEXT)
- `to_user_id`: User who receives penalty (TEXT, optional)
- `amount`: Penalty amount (INTEGER)
- `reason`: Reason for penalty (TEXT)
- `date`: Penalty date (DATE)
- `status`: Penalty status (pending/paid)
- `created_at`: Penalty creation timestamp

### Achievements Table
- `id`: Unique identifier (TEXT)
- `user_id`: Reference to user (TEXT)
- `achievement_id`: Achievement type identifier (TEXT)
- `title`: Achievement title (TEXT)
- `description`: Achievement description (TEXT)
- `icon`: Achievement icon (TEXT)
- `points`: Points awarded (INTEGER)
- `unlocked_at`: Achievement unlock timestamp

### Settings Table
- `id`: Auto-incrementing identifier (SERIAL)
- `penalty_amount`: Default penalty amount (INTEGER)
- `points_per_task`: Points per completed task (INTEGER)
- `points_per_missed`: Points for missed task (INTEGER)
- `theme`: App theme (TEXT)
- `notifications`: Enable notifications (BOOLEAN)
- `created_at`: Settings creation timestamp
- `updated_at`: Last update timestamp

## 🚀 Benefits of Using Supabase

1. **Free Tier**: 500MB database, 50,000 monthly active users
2. **Real-time**: Built-in real-time subscriptions
3. **Authentication**: User authentication system
4. **Storage**: File storage for proof uploads
5. **Backups**: Automatic backups
6. **API**: RESTful and GraphQL APIs
7. **Dashboard**: Easy-to-use admin interface

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your Supabase URL is correct
2. **RLS Errors**: Check that RLS policies are set up correctly
3. **Connection Errors**: Verify your API keys are correct
4. **Schema Errors**: Ensure all tables are created with the correct structure

### Debug Mode:
Add this to your `supabase.js` for debugging:
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

## 🚀 Deployment Considerations

### Environment Variables for Production
When deploying your app, make sure to set the environment variables in your hosting platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Netlify:**
- Go to Site Settings → Environment Variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Other Platforms:**
- Set the environment variables according to your hosting provider's documentation

### Security Best Practices
1. **Never commit `.env` files** to version control
2. **Use different databases** for development and production
3. **Enable Row Level Security** in Supabase
4. **Regular backups** of your database
5. **Monitor usage** to stay within free tier limits

## 📱 Next Steps

1. **Authentication**: Add user login/signup
2. **Real-time**: Enable real-time updates
3. **File Storage**: Use Supabase Storage for proof uploads
4. **Backup**: Set up automatic data backups
5. **Analytics**: Add usage analytics
