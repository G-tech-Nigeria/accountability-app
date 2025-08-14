import React, { useState, useEffect } from 'react';
import AchievementNotification from './AchievementNotification';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingAchievements, setPendingAchievements] = useState({});
  const [reloadNotification, setReloadNotification] = useState(null);

  // Listen for achievement unlock events
  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const { achievement, user } = event.detail;
      addAchievementToPending(achievement, user);
    };

    const handleDatabaseChange = (event) => {
      const { table } = event.detail;
      setReloadNotification({
        id: Date.now(),
        table,
        message: `Database updated (${table}). Reloading in 1 second...`
      });
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    window.addEventListener('databaseChange', handleDatabaseChange);
    
    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
      window.removeEventListener('databaseChange', handleDatabaseChange);
    };
  }, []);

  const addAchievementToPending = (achievement, user) => {
    const userId = user.id;
    setPendingAchievements(prev => {
      const userAchievements = prev[userId] || { achievements: [], user: user };
      const updated = {
        ...prev,
        [userId]: {
          achievements: [...userAchievements.achievements, achievement],
          user: user
        }
      };
      
      // Schedule notification after a short delay to batch multiple achievements
      setTimeout(() => {
        showNotification(userId);
      }, 100);
      
      return updated;
    });
  };

  const showNotification = (userId) => {
    const userData = pendingAchievements[userId];
    if (!userData || !userData.achievements || userData.achievements.length === 0) return;

    const id = Date.now();
    
    setNotifications(prev => [...prev, { 
      id, 
      achievements: userData.achievements, 
      user: userData.user 
    }]);
    
    // Clear pending achievements for this user
    setPendingAchievements(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div key={notification.id} style={{
          position: 'fixed',
          top: `${20 + (index * 120)}px`,
          right: '20px',
          zIndex: 1000 + index
        }}>
          <AchievementNotification
            achievements={notification.achievements}
            user={notification.user}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
      
      {/* Reload Notification */}
      {reloadNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'var(--accent-blue)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{ animation: 'spin 1s linear infinite' }}>🔄</div>
          {reloadNotification.message}
        </div>
      )}
    </>
  );
};

export default NotificationManager;
