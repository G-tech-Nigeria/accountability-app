import { getTasks, getPenalties, getAchievements as getStorageAchievements, addAchievement } from './database.js';
import { format, isToday, isYesterday, startOfWeek, endOfWeek } from 'date-fns';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Existing achievements (10)
  perfect_day: {
    id: 'perfect_day',
    title: 'Perfect Day',
    description: 'Complete all tasks for the day',
    icon: '🌟',
    points: 10,
    color: 'yellow'
  },
  streak_7: {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    points: 25,
    color: 'orange'
  },
  streak_30: {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    points: 100,
    color: 'purple'
  },
  first_completion: {
    id: 'first_completion',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: '🎯',
    points: 5,
    color: 'green'
  },
  comeback_king: {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Go from <50% to 100% completion',
    icon: '⚡',
    points: 15,
    color: 'blue'
  },
  penalty_king: {
    id: 'penalty_king',
    title: 'Penalty King',
    description: 'Most penalties in a week',
    icon: '💸',
    points: 20,
    color: 'red'
  },
  task_master: {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 50 tasks total',
    icon: '👑',
    points: 50,
    color: 'purple'
  },
  early_bird: {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete all tasks before noon',
    icon: '🌅',
    points: 15,
    color: 'orange'
  },
  night_owl: {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete tasks after 10 PM',
    icon: '🦉',
    points: 10,
    color: 'blue'
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete all weekend tasks',
    icon: '🏆',
    points: 20,
    color: 'green'
  },

  // NEW ACHIEVEMENTS - BATCH 1 (Task Completion)
  perfect_week: {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all tasks for 7 consecutive days',
    icon: '⭐',
    points: 100,
    color: 'yellow'
  },
  perfect_month: {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete all tasks for 30 consecutive days',
    icon: '💫',
    points: 400,
    color: 'yellow'
  },
  task_champion: {
    id: 'task_champion',
    title: 'Task Champion',
    description: 'Complete 20 tasks in a day',
    icon: '🏅',
    points: 100,
    color: 'orange'
  },
  productivity_pro: {
    id: 'productivity_pro',
    title: 'Productivity Pro',
    description: 'Complete 10 tasks in a day',
    icon: '🚀',
    points: 50,
    color: 'blue'
  },
  consistency_king: {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Complete all tasks for 3 days in a row',
    icon: '👑',
    points: 30,
    color: 'purple'
  },
  fortnight_fighter: {
    id: 'fortnight_fighter',
    title: 'Fortnight Fighter',
    description: 'Complete all tasks for 14 days in a row',
    icon: '⚔️',
    points: 150,
    color: 'red'
  },
  quarterly_queen: {
    id: 'quarterly_queen',
    title: 'Quarterly Queen',
    description: 'Complete all tasks for 90 days in a row',
    icon: '👸',
    points: 500,
    color: 'purple'
  },

  // Time-Based Achievements
  dawn_patrol: {
    id: 'dawn_patrol',
    title: 'Dawn Patrol',
    description: 'Complete 3 tasks before 9 AM',
    icon: '🌄',
    points: 40,
    color: 'orange'
  },
  sunrise_warrior: {
    id: 'sunrise_warrior',
    title: 'Sunrise Warrior',
    description: 'Complete 5 tasks before 9 AM',
    icon: '🌅',
    points: 75,
    color: 'orange'
  },
  midnight_master: {
    id: 'midnight_master',
    title: 'Midnight Master',
    description: 'Complete 3 tasks after 10 PM',
    icon: '🌙',
    points: 40,
    color: 'blue'
  },
  late_night_legend: {
    id: 'late_night_legend',
    title: 'Late Night Legend',
    description: 'Complete 5 tasks after 10 PM',
    icon: '🦇',
    points: 75,
    color: 'blue'
  },
  weekend_master: {
    id: 'weekend_master',
    title: 'Weekend Master',
    description: 'Complete all weekend tasks for 4 weeks',
    icon: '🎉',
    points: 100,
    color: 'green'
  },

  // Proof-Based Achievements
  proof_provider: {
    id: 'proof_provider',
    title: 'Proof Provider',
    description: 'Upload proof for 5 tasks',
    icon: '📸',
    points: 30,
    color: 'green'
  },
  evidence_expert: {
    id: 'evidence_expert',
    title: 'Evidence Expert',
    description: 'Upload proof for 20 tasks',
    icon: '🔍',
    points: 100,
    color: 'blue'
  },
  documentation_master: {
    id: 'documentation_master',
    title: 'Documentation Master',
    description: 'Upload proof for 50 tasks',
    icon: '📋',
    points: 200,
    color: 'purple'
  },

  // Milestone Achievements
  task_novice: {
    id: 'task_novice',
    title: 'Task Novice',
    description: 'Complete 25 total tasks',
    icon: '🎓',
    points: 50,
    color: 'green'
  },
  task_apprentice: {
    id: 'task_apprentice',
    title: 'Task Apprentice',
    description: 'Complete 100 total tasks',
    icon: '📚',
    points: 150,
    color: 'blue'
  },
  task_expert: {
    id: 'task_expert',
    title: 'Task Expert',
    description: 'Complete 500 total tasks',
    icon: '🎖️',
    points: 300,
    color: 'purple'
  },
  task_legend: {
    id: 'task_legend',
    title: 'Task Legend',
    description: 'Complete 5000 total tasks',
    icon: '🏆',
    points: 1000,
    color: 'gold'
  },
  point_collector: {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 100 total points',
    icon: '💰',
    points: 25,
    color: 'green'
  },
  point_hunter: {
    id: 'point_hunter',
    title: 'Point Hunter',
    description: 'Earn 500 total points',
    icon: '🎯',
    points: 75,
    color: 'blue'
  },
  point_master: {
    id: 'point_master',
    title: 'Point Master',
    description: 'Earn 1000 total points',
    icon: '💎',
    points: 150,
    color: 'purple'
  },
  point_legend: {
    id: 'point_legend',
    title: 'Point Legend',
    description: 'Earn 5000 total points',
    icon: '👑',
    points: 500,
    color: 'gold'
  },

  // Speed Challenges
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 3 tasks within 1 hour',
    icon: '⚡',
    points: 40,
    color: 'orange'
  },
  lightning_fast: {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Complete 5 tasks within 2 hours',
    icon: '🌩️',
    points: 75,
    color: 'blue'
  },
  supersonic: {
    id: 'supersonic',
    title: 'Supersonic',
    description: 'Complete 10 tasks within 4 hours',
    icon: '🚀',
    points: 150,
    color: 'purple'
  },

  // Consistency Challenges
  same_time_same_place: {
    id: 'same_time_same_place',
    title: 'Same Time, Same Place',
    description: 'Complete tasks at the same time for 7 days',
    icon: '⏰',
    points: 80,
    color: 'blue'
  },
  routine_master: {
    id: 'routine_master',
    title: 'Routine Master',
    description: 'Complete the same type of task for 14 days',
    icon: '🔄',
    points: 100,
    color: 'purple'
  },
  habit_former: {
    id: 'habit_former',
    title: 'Habit Former',
    description: 'Complete tasks for 21 consecutive days',
    icon: '🧠',
    points: 150,
    color: 'green'
  },

  // Special Event Achievements
  new_years_resolution: {
    id: 'new_years_resolution',
    title: 'New Year\'s Resolution',
    description: 'Complete tasks on January 1st',
    icon: '🎊',
    points: 30,
    color: 'gold'
  },
  valentines_helper: {
    id: 'valentines_helper',
    title: 'Valentine\'s Helper',
    description: 'Complete tasks on February 14th',
    icon: '💝',
    points: 25,
    color: 'pink'
  },
  spring_cleaner: {
    id: 'spring_cleaner',
    title: 'Spring Cleaner',
    description: 'Complete 5 tasks on the first day of spring',
    icon: '🌸',
    points: 40,
    color: 'green'
  },
  summer_solstice: {
    id: 'summer_solstice',
    title: 'Summer Solstice',
    description: 'Complete tasks on the longest day of the year',
    icon: '☀️',
    points: 30,
    color: 'orange'
  },
  autumn_achiever: {
    id: 'autumn_achiever',
    title: 'Autumn Achiever',
    description: 'Complete tasks on the first day of autumn',
    icon: '🍂',
    points: 30,
    color: 'orange'
  },
  winter_warrior: {
    id: 'winter_warrior',
    title: 'Winter Warrior',
    description: 'Complete tasks on the shortest day of the year',
    icon: '❄️',
    points: 30,
    color: 'blue'
  },

  // Fun & Unique Achievements
  palindrome_day: {
    id: 'palindrome_day',
    title: 'Palindrome Day',
    description: 'Complete tasks on a date that reads the same forwards/backwards',
    icon: '🔄',
    points: 30,
    color: 'purple'
  },
  leap_year_legend: {
    id: 'leap_year_legend',
    title: 'Leap Year Legend',
    description: 'Complete tasks on February 29th',
    icon: '🐸',
    points: 50,
    color: 'green'
  },
  lucky_day: {
    id: 'lucky_day',
    title: 'Lucky Day',
    description: 'Complete a task on a day ending in your lucky number',
    icon: '🍀',
    points: 20,
    color: 'green'
  },
  midnight_magic: {
    id: 'midnight_magic',
    title: 'Midnight Magic',
    description: 'Complete a task at exactly midnight',
    icon: '✨',
    points: 30,
    color: 'purple'
  },

  // Elite Achievements
  iron_will: {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Complete all tasks for 100 consecutive days',
    icon: '🦾',
    points: 1000,
    color: 'gold'
  },
  task_titan: {
    id: 'task_titan',
    title: 'Task Titan',
    description: 'Complete 10,000 total tasks',
    icon: '🏛️',
    points: 2000,
    color: 'gold'
  },
  accountability_legend: {
    id: 'accountability_legend',
    title: 'Accountability Legend',
    description: 'Earn 10,000 total points',
    icon: '🌟',
    points: 2500,
    color: 'gold'
  },
  perfect_year: {
    id: 'perfect_year',
    title: 'Perfect Year',
    description: 'Complete all tasks for an entire year',
    icon: '📅',
    points: 5000,
    color: 'gold'
  },

  // Additional Milestones
  century_club: {
    id: 'century_club',
    title: 'Century Club',
    description: 'Complete your 100th task',
    icon: '💯',
    points: 75,
    color: 'purple'
  },
  millennium_maker: {
    id: 'millennium_maker',
    title: 'Millennium Maker',
    description: 'Complete your 1000th task',
    icon: '🎯',
    points: 200,
    color: 'gold'
  },
  streak_14: {
    id: 'streak_14',
    title: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: '⚔️',
    points: 75,
    color: 'red'
  },
  streak_100: {
    id: 'streak_100',
    title: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '💎',
    points: 500,
    color: 'gold'
  }
};

// Check if user already has an achievement
const hasAchievement = async (userId, achievementId) => {
  const achievements = await getStorageAchievements();
  return achievements.some(achievement =>
    achievement.userId === userId && achievement.achievementId === achievementId
  );
};

// Check for perfect day achievement
const checkPerfectDay = async (userId, date) => {
  if (await hasAchievement(userId, 'perfect_day')) return;
  
  const tasks = await getTasks();
  const userTasks = tasks.filter(task => 
    task.userId === userId && 
    task.date === date
  );
  
  if (userTasks.length > 0 && userTasks.every(task => task.status === 'completed')) {
    await addAchievement({
      userId,
      achievementId: 'perfect_day',
      title: ACHIEVEMENTS.perfect_day.title,
      description: ACHIEVEMENTS.perfect_day.description,
      icon: ACHIEVEMENTS.perfect_day.icon,
      points: ACHIEVEMENTS.perfect_day.points
    });
  }
};

// Check for streak achievements
const checkStreakAchievements = async (userId) => {
  const tasks = await getTasks();
  const userTasks = tasks.filter(task => task.userId === userId);
  
  // Calculate current streak
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayTasks = userTasks.filter(task => task.date === dateStr);
    if (dayTasks.length === 0) break;
    
    const allCompleted = dayTasks.every(task => task.status === 'completed');
    if (!allCompleted) break;
    
    streak++;
  }
  
  // Check 7-day streak
  if (streak >= 7 && !(await hasAchievement(userId, 'streak_7'))) {
    await addAchievement({
      userId,
      achievementId: 'streak_7',
      title: ACHIEVEMENTS.streak_7.title,
      description: ACHIEVEMENTS.streak_7.description,
      icon: ACHIEVEMENTS.streak_7.icon,
      points: ACHIEVEMENTS.streak_7.points
    });
  }
  
  // Check 30-day streak
  if (streak >= 30 && !(await hasAchievement(userId, 'streak_30'))) {
    await addAchievement({
      userId,
      achievementId: 'streak_30',
      title: ACHIEVEMENTS.streak_30.title,
      description: ACHIEVEMENTS.streak_30.description,
      icon: ACHIEVEMENTS.streak_30.icon,
      points: ACHIEVEMENTS.streak_30.points
    });
  }
};

// Check for first completion
const checkFirstCompletion = async (userId) => {
  if (await hasAchievement(userId, 'first_completion')) return;
  
  const tasks = await getTasks();
  const completedTasks = tasks.filter(task => 
    task.userId === userId && task.status === 'completed'
  );
  
  if (completedTasks.length > 0) {
    await addAchievement({
      userId,
      achievementId: 'first_completion',
      title: ACHIEVEMENTS.first_completion.title,
      description: ACHIEVEMENTS.first_completion.description,
      icon: ACHIEVEMENTS.first_completion.icon,
      points: ACHIEVEMENTS.first_completion.points
    });
  }
};

// Check for comeback king
const checkComebackKing = async (userId, date) => {
  if (await hasAchievement(userId, 'comeback_king')) return;
  
  const tasks = await getTasks();
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const yesterdayTasks = tasks.filter(task => 
    task.userId === userId && task.date === yesterdayStr
  );
  
  const todayTasks = tasks.filter(task => 
    task.userId === userId && task.date === date
  );
  
  if (yesterdayTasks.length > 0 && todayTasks.length > 0) {
    const yesterdayRate = yesterdayTasks.filter(t => t.status === 'completed').length / yesterdayTasks.length;
    const todayRate = todayTasks.filter(t => t.status === 'completed').length / todayTasks.length;
    
    if (yesterdayRate < 0.5 && todayRate === 1) {
      await addAchievement({
        userId,
        achievementId: 'comeback_king',
        title: ACHIEVEMENTS.comeback_king.title,
        description: ACHIEVEMENTS.comeback_king.description,
        icon: ACHIEVEMENTS.comeback_king.icon,
        points: ACHIEVEMENTS.comeback_king.points
      });
    }
  }
};

// Check for penalty king
const checkPenaltyKing = async (userId, date) => {
  if (await hasAchievement(userId, 'penalty_king')) return;
  
  const penalties = await getPenalties();
  const weekStart = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(date), { weekStartsOn: 1 });
  
  const weekPenalties = penalties.filter(penalty => {
    const penaltyDate = new Date(penalty.date);
    return penaltyDate >= weekStart && penaltyDate <= weekEnd;
  });
  
  // Count penalties per user
  const userPenaltyCounts = {};
  weekPenalties.forEach(penalty => {
    userPenaltyCounts[penalty.fromUserId] = (userPenaltyCounts[penalty.fromUserId] || 0) + 1;
  });
  
  // Find user with most penalties
  const maxPenalties = Math.max(...Object.values(userPenaltyCounts), 0);
  const maxPenaltyUsers = Object.keys(userPenaltyCounts).filter(
    uid => userPenaltyCounts[uid] === maxPenalties
  );
  
  if (maxPenaltyUsers.includes(userId) && maxPenalties >= 3) {
    await addAchievement({
      userId,
      achievementId: 'penalty_king',
      title: ACHIEVEMENTS.penalty_king.title,
      description: ACHIEVEMENTS.penalty_king.description,
      icon: ACHIEVEMENTS.penalty_king.icon,
      points: ACHIEVEMENTS.penalty_king.points
    });
  }
};

// Check for task master
const checkTaskMaster = async (userId) => {
  if (await hasAchievement(userId, 'task_master')) return;
  
  const tasks = await getTasks();
  const completedTasks = tasks.filter(task => 
    task.userId === userId && task.status === 'completed'
  );
  
  if (completedTasks.length >= 50) {
    await addAchievement({
      userId,
      achievementId: 'task_master',
      title: ACHIEVEMENTS.task_master.title,
      description: ACHIEVEMENTS.task_master.description,
      icon: ACHIEVEMENTS.task_master.icon,
      points: ACHIEVEMENTS.task_master.points
    });
  }
};

// Check for early bird
const checkEarlyBird = async (userId, date) => {
  if (await hasAchievement(userId, 'early_bird')) return;
  
  const tasks = await getTasks();
  const dayTasks = tasks.filter(task => 
    task.userId === userId && task.date === date
  );
  
  if (dayTasks.length > 0) {
    const allCompleted = dayTasks.every(task => task.status === 'completed');
    if (allCompleted) {
      // Check if all tasks were completed before noon (this would need timestamp data)
      // For now, we'll just check if all tasks are completed
      await addAchievement({
        userId,
        achievementId: 'early_bird',
        title: ACHIEVEMENTS.early_bird.title,
        description: ACHIEVEMENTS.early_bird.description,
        icon: ACHIEVEMENTS.early_bird.icon,
        points: ACHIEVEMENTS.early_bird.points
      });
    }
  }
};

// Check for weekend warrior
const checkWeekendWarrior = async (userId, date) => {
  if (await hasAchievement(userId, 'weekend_warrior')) return;
  
  const checkDate = new Date(date);
  const dayOfWeek = checkDate.getDay();
  
  // Check if it's weekend (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    const tasks = await getTasks();
    const dayTasks = tasks.filter(task => 
      task.userId === userId && task.date === date
    );
    
    if (dayTasks.length > 0 && dayTasks.every(task => task.status === 'completed')) {
      await addAchievement({
        userId,
        achievementId: 'weekend_warrior',
        title: ACHIEVEMENTS.weekend_warrior.title,
        description: ACHIEVEMENTS.weekend_warrior.description,
        icon: ACHIEVEMENTS.weekend_warrior.icon,
        points: ACHIEVEMENTS.weekend_warrior.points
      });
    }
  }
};

// Main function to check all achievements
export const checkAllAchievements = async (userId, date) => {
  try {
    await checkPerfectDay(userId, date);
    await checkStreakAchievements(userId);
    await checkFirstCompletion(userId);
    await checkComebackKing(userId, date);
    await checkPenaltyKing(userId, date);
    await checkTaskMaster(userId);
    await checkEarlyBird(userId, date);
    await checkWeekendWarrior(userId, date);
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

// Get achievements for a specific user
export const getUserAchievements = async (userId) => {
  const achievements = await getStorageAchievements();
  const userAchievements = achievements.filter(achievement => achievement.userId === userId);
  
  return userAchievements.map(achievement => ({
    ...achievement,
    achievementData: ACHIEVEMENTS[achievement.achievementId]
  }));
};

// Get all achievements with full data
export const getAllAchievements = async () => {
  const achievements = await getStorageAchievements();
  return achievements.map(achievement => ({
    ...achievement,
    achievementData: ACHIEVEMENTS[achievement.achievementId]
  }));
};
