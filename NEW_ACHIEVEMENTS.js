// 50 New Achievements to Add to the App
// Copy these into the ACHIEVEMENTS object in src/utils/achievements.js

export const NEW_ACHIEVEMENTS = {
  // Task Completion Achievements (7)
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

  // Time-Based Achievements (5)
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

  // Proof-Based Achievements (3)
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

  // Milestone Achievements (8)
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

  // Speed Challenges (3)
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 3 tasks within 1 hour of each other',
    icon: '⚡',
    points: 40,
    color: 'orange'
  },
  lightning_fast: {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Complete 5 tasks within 2 hours of each other',
    icon: '🌩️',
    points: 75,
    color: 'blue'
  },
  supersonic: {
    id: 'supersonic',
    title: 'Supersonic',
    description: 'Complete 10 tasks within 4 hours of each other',
    icon: '🚀',
    points: 150,
    color: 'purple'
  },

  // Consistency Challenges (3)
  same_time_same_place: {
    id: 'same_time_same_place',
    title: 'Same Time, Same Place',
    description: 'Complete tasks at the same hour for 7 consecutive days',
    icon: '⏰',
    points: 80,
    color: 'blue'
  },
  routine_master: {
    id: 'routine_master',
    title: 'Routine Master',
    description: 'Complete the same task title for 14 consecutive days',
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

  // Special Event Achievements (6)
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
    description: 'Complete 5 tasks on March 20th (first day of spring)',
    icon: '🌸',
    points: 40,
    color: 'green'
  },
  summer_solstice: {
    id: 'summer_solstice',
    title: 'Summer Solstice',
    description: 'Complete tasks on June 21st (longest day of the year)',
    icon: '☀️',
    points: 30,
    color: 'orange'
  },
  autumn_achiever: {
    id: 'autumn_achiever',
    title: 'Autumn Achiever',
    description: 'Complete tasks on September 22nd (first day of autumn)',
    icon: '🍂',
    points: 30,
    color: 'orange'
  },
  winter_warrior: {
    id: 'winter_warrior',
    title: 'Winter Warrior',
    description: 'Complete tasks on December 21st (shortest day of the year)',
    icon: '❄️',
    points: 30,
    color: 'blue'
  },

  // Fun & Unique Achievements (4)
  palindrome_day: {
    id: 'palindrome_day',
    title: 'Palindrome Day',
    description: 'Complete tasks on a date that reads the same forwards/backwards (e.g., 12/21/21)',
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
  lucky_seven: {
    id: 'lucky_seven',
    title: 'Lucky Seven',
    description: 'Complete a task on the 7th, 17th, or 27th of any month',
    icon: '🍀',
    points: 20,
    color: 'green'
  },
  midnight_magic: {
    id: 'midnight_magic',
    title: 'Midnight Magic',
    description: 'Complete a task at exactly midnight (12:00 AM)',
    icon: '✨',
    points: 30,
    color: 'purple'
  },

  // Elite Achievements (4)
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

  // Additional Milestones (4)
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

// Summary of new achievements
export const NEW_ACHIEVEMENTS_SUMMARY = {
  total: 50,
  categories: {
    'Task Completion': 7,
    'Time-Based': 5,
    'Proof-Based': 3,
    'Milestones': 8,
    'Speed Challenges': 3,
    'Consistency Challenges': 3,
    'Special Events': 6,
    'Fun & Unique': 4,
    'Elite': 4,
    'Additional Milestones': 4
  },
  totalPoints: 8500,
  implementation: 'Copy these achievements into the ACHIEVEMENTS object in src/utils/achievements.js'
};
