import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  FileText, 
  Target,
  Crown,
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Zap,
  Trophy,
  Star,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind
} from 'lucide-react';
import { calculateMissedTaskPenalties } from '../utils/database';
import { getUserAchievements } from '../utils/achievements';
import { checkAllAchievements } from '../utils/achievements';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import ProgressCircle from '../components/ProgressCircle';
import { useRealtimeData } from '../hooks/useRealtimeData';

const Dashboard = ({ currentDate }) => {
  const { users, tasks, penalties: penaltySummary, loading, error, refreshData } = useRealtimeData();
  const [achievements, setAchievements] = useState({});
  const [stats, setStats] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Calculate stats when users or tasks change
  useEffect(() => {
    if (users.length > 0 && tasks.length > 0) {
      calculateStats();
      loadAchievements();
    }
  }, [users, tasks, currentDate]);

  // Check for penalties when component mounts
  useEffect(() => {
    const checkPenalties = async () => {
      try {
        // Use current system date (August 2025)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check entire current month for missed tasks and calculate penalties
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        
        // Get all days in the current month
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        // Calculate penalties for each day in the month
        for (const day of daysInMonth) {
          const dateStr = day.toISOString().split('T')[0];
          await calculateMissedTaskPenalties(dateStr);
        }
        
        // Reload dashboard data to show updated penalties
        await refreshData();
      } catch (error) {
        console.error('Error calculating penalties in Dashboard:', error);
      }
    };
    
    checkPenalties();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Using OpenWeatherMap API (you'll need to add your API key)
          const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          
          if (response.ok) {
            const data = await response.json();
            setWeather(data);
          } else {
            // Weather API not available, using mock data
            // Fallback to mock weather data
            setWeather({
              weather: [{ main: 'Clear', description: 'clear sky' }],
              main: { temp: 22, feels_like: 24 },
              name: 'Your Location'
            });
          }
        }, (error) => {
          // Location not available, using mock data
          // Fallback to mock weather data
          setWeather({
            weather: [{ main: 'Clear', description: 'clear sky' }],
            main: { temp: 22, feels_like: 24 },
            name: 'Your Location'
          });
        });
      } else {
        // Fallback to mock weather data
        setWeather({
          weather: [{ main: 'Clear', description: 'clear sky' }],
          main: { temp: 22, feels_like: 24 },
          name: 'Your Location'
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock weather data
      setWeather({
        weather: [{ main: 'Clear', description: 'clear sky' }],
        main: { temp: 22, feels_like: 24 },
        name: 'Your Location'
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun size={20} />;
      case 'clouds':
        return <Cloud size={20} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={20} />;
      case 'snow':
        return <CloudSnow size={20} />;
      case 'wind':
        return <Wind size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  const calculateStats = () => {
    // Calculate stats for each user
    const userStats = {};
    users.forEach(user => {
      const userTasks = tasks.filter(task => task.userId === user.id);
      const completedTasks = userTasks.filter(task => task.status === 'completed');
      const todayTasks = userTasks.filter(task => task.date === currentDate);
      const todayCompleted = todayTasks.filter(task => task.status === 'completed');
      
      // Calculate streak
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
      
      userStats[user.id] = {
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
        todayTasks: todayTasks.length,
        todayCompleted: todayCompleted.length,
        todayRate: todayTasks.length > 0 ? (todayCompleted.length / todayTasks.length) * 100 : 0,
        streak: streak
      };
    });

    setStats(userStats);
  };

  const loadAchievements = async () => {
    try {
      // Get achievements for each user
      const userAchievements = {};
      for (const user of users) {
        userAchievements[user.id] = await getUserAchievements(user.id);
      }
      setAchievements(userAchievements);

      // Check for new achievements
      for (const user of users) {
        try {
          await checkAllAchievements(user.id, currentDate);
        } catch (err) {
          console.error('Error checking achievements for user:', user.id, err);
        }
      }
    } catch (err) {
      console.error('Error loading achievements:', err);
    }
  };

  if (error) {
    return (
      <div className="container p-6">
        <div className="card">
          <div className="card-body">
            <h1 className="text-xl font-bold text-red mb-4">Error Loading Dashboard</h1>
            <p className="text-secondary mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">Loading Dashboard...</div>
    );
  }

  // Sort users by points for leaderboard
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>Overview</span>
      </div>



      {/* Welcome Section */}
      <div className="ai-assistant-card">
        <div className="ai-assistant-icon">
          <Target size={32} />
        </div>
        <div className="ai-assistant-prompt">
          Keep pushing forward, you've got this! 💪
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              <span>{format(currentTime, 'HH:mm:ss')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {weatherLoading ? (
                <span>Loading weather...</span>
              ) : weather ? (
                <>
                  {getWeatherIcon(weather.weather[0]?.main)}
                  <span>{Math.round(weather.main?.temp)}°C</span>
                  <span>•</span>
                  <span>{weather.weather[0]?.description}</span>
                </>
              ) : (
                <span>Weather unavailable</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} />
              <span>{format(new Date(currentDate), 'EEEE, MMMM do, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Progress Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <BarChart3 size={16} />
          Today's Progress
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {users.map(user => {
            const userStats = stats[user.id] || {};
            const userAchievements = achievements[user.id] || [];
            const penaltyData = penaltySummary[user.id] || { owed: 0, owedTo: 0, total: 0 };
            
            return (
              <div key={user.id} style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--sidebar-border)',
                padding: '1.5rem'
              }}>
                {/* User Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--sidebar-border)'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      {user.name}
                    </h3>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {userStats.todayCompleted || 0}/{userStats.todayTasks || 0} tasks today
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  {/* Completed Tasks */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid var(--sidebar-border)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem'
                    }}>
                      <ProgressCircle 
                        progress={userStats.completionRate || 0}
                        size={40}
                        strokeWidth={3}
                        showPercentage={false}
                      />
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {userStats.completedTasks || 0}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Completed Tasks
                    </div>
                  </div>

                  {/* Total Streak */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid var(--sidebar-border)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      color: 'white'
                    }}>
                      <Zap size={16} />
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {userStats.streak || 0}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Day Streak
                    </div>
                  </div>

                  {/* Total Penalties */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid var(--sidebar-border)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      color: 'white'
                    }}>
                      <AlertTriangle size={16} />
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      £{penaltyData.total || 0}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Total Penalties
                    </div>
                  </div>

                  {/* Total Achievements */}
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    border: '1px solid var(--sidebar-border)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      color: 'white'
                    }}>
                      <Trophy size={16} />
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {userAchievements.length}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Achievements
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Crown size={16} />
          Leaderboard
        </div>
        
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--sidebar-border)',
          overflow: 'hidden'
        }}>
          {sortedUsers.map((user, index) => {
            const userStats = stats[user.id] || {};
            const isTopThree = index < 3;
            
            return (
              <div key={user.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderBottom: index < sortedUsers.length - 1 ? '1px solid var(--sidebar-border)' : 'none',
                background: isTopThree ? 'var(--bg-primary)' : 'transparent'
              }}>
                {/* Rank */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginRight: '1rem',
                  background: isTopThree ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                  color: isTopThree ? 'white' : 'var(--text-secondary)'
                }}>
                  {index + 1}
                </div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    {index === 0 && <Crown size={16} style={{ color: 'var(--accent-yellow)' }} />}
                    <span style={{ fontSize: '1.25rem' }}>{user.avatar}</span>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}>
                      {user.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {userStats.completionRate?.toFixed(1) || 0}% completion • {userStats.streak || 0} day streak
                  </div>
                </div>

                {/* Points */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {user.points || 0} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
