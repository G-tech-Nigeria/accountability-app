import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

const AchievementNotification = ({ achievements, user, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 8 seconds for multiple achievements
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!achievements || !user || achievements.length === 0) return null;

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const isMultiple = achievements.length > 1;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)',
        padding: '1rem',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        {/* Achievement Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--accent-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0
        }}>
          {isMultiple ? '🏆' : achievements[0].icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>{user.avatar}</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              {user.name}
            </span>
          </div>
          
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem 0'
          }}>
            {isMultiple ? `${achievements.length} Achievements Unlocked!` : achievements[0].title}
          </h3>
          
          {isMultiple ? (
            <div style={{ marginBottom: '0.5rem' }}>
              {achievements.map((achievement, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem',
                  fontSize: '0.75rem'
                }}>
                  <span style={{ fontSize: '1rem' }}>{achievement.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {achievement.title}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    (+{achievement.points} pts)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: '0 0 0.5rem 0',
              lineHeight: '1.4'
            }}>
              {achievements[0].description}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--accent-yellow)',
            fontWeight: '600'
          }}>
            <Trophy size={12} />
            <span>+{totalPoints} total points earned!</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;
