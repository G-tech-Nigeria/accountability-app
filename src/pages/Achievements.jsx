import React, { useState, useEffect } from 'react';
import { getUsers } from '../utils/database';
import { getAllAchievements } from '../utils/achievements';
import { ACHIEVEMENTS } from '../utils/achievements';
import { format } from 'date-fns';
import { Trophy, Star, Calendar } from 'lucide-react';
import { onTableUpdate } from '../utils/realtime';

const Achievements = () => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await loadAchievements();
    };
    loadData();
  }, []);

  // Real-time updates for users and achievements
  useEffect(() => {
    const unsubscribeUsers = onTableUpdate('users', async (payload) => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error updating users in Achievements:', err);
      }
    });

    const unsubscribeAchievements = onTableUpdate('achievements', async (payload) => {
      try {
        const achievementsData = await getAllAchievements();
        setAchievements(achievementsData);
      } catch (err) {
        console.error('Error updating achievements in Achievements:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeAchievements();
    };
  }, []);

  const loadAchievements = async () => {
    try {
      const usersData = await getUsers();
      const achievementsData = await getAllAchievements();
      
      setUsers(usersData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setAchievements([]);
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getAchievementsForUser = (userId) => {
    return achievements.filter(achievement => achievement.userId === userId);
  };

  const getAchievementCount = (userId) => {
    return getAchievementsForUser(userId).length;
  };

  const getTotalPointsForUser = (userId) => {
    return getAchievementsForUser(userId).reduce((sum, a) => sum + a.points, 0);
  };

  const AchievementCard = ({ achievement }) => {
    // Use achievement data directly from storage, fallback to ACHIEVEMENTS if needed
    const achievementData = ACHIEVEMENTS[achievement.achievementId] || {
      icon: achievement.icon || '🏆',
      title: achievement.title || 'Unknown Achievement',
      description: achievement.description || 'Achievement details not available'
    };
    
    return (
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '0.5rem',
        border: '1px solid var(--sidebar-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          {/* Achievement Icon */}
          <div style={{
            fontSize: '1.25rem',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent-yellow)',
            borderRadius: '6px',
            flexShrink: 0
          }}>
            {achievementData.icon}
          </div>

          {/* Achievement Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0,
                wordWrap: 'break-word'
              }}>
                {achievement.title || achievementData.title}
              </h3>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--accent-yellow)'
                }}>
                  +{achievement.points}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  points
                </div>
              </div>
            </div>
            
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
              lineHeight: '1.4'
            }}>
              {achievement.description || achievementData.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <Calendar size={12} />
              <span>
                {achievement.unlockedAt && !isNaN(new Date(achievement.unlockedAt).getTime()) ? 
                  format(new Date(achievement.unlockedAt), 'MMM d, yyyy') : 
                  'Recently unlocked'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>Achievements</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Achievements
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track progress and unlock achievements by completing tasks
        </p>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--sidebar-border)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--accent-blue)',
            marginBottom: '0.5rem'
          }}>
            {achievements.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total Unlocked
          </div>
        </div>
        
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--sidebar-border)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--accent-green)',
            marginBottom: '0.5rem'
          }}>
            {Object.keys(ACHIEVEMENTS).length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Available
          </div>
        </div>
        
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--sidebar-border)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--accent-yellow)',
            marginBottom: '0.5rem'
          }}>
            {achievements.reduce((sum, a) => sum + a.points, 0)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total Points
          </div>
        </div>
      </div>

      {/* Dynamic Column Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
        gap: '1rem',
        minHeight: 'calc(100vh - 400px)'
      }}>
        {users.map(user => (
          <div key={user.id} style={{ 
            background: 'var(--bg-card)', 
            borderRadius: '12px',
            border: '1px solid var(--sidebar-border)',
            padding: '1rem'
          }}>
            {/* Column Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--sidebar-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{user.avatar}</span>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {user.name}
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trophy size={12} />
                      {getAchievementCount(user.id)} achievements
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={12} />
                      {getTotalPointsForUser(user.id)} points
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements List */}
            <div style={{ marginBottom: '1rem' }}>
              {getAchievementsForUser(user.id).length > 0 ? (
                getAchievementsForUser(user.id).map((achievement, index) => (
                  <AchievementCard
                    key={`${user.id}-${achievement.id}-${index}`}
                    achievement={achievement}
                  />
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                  <p style={{ fontSize: '0.875rem' }}>
                    No achievements unlocked yet
                  </p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Complete tasks to earn achievements!
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
