import React, { useEffect, useRef } from 'react';

const ProgressCircle = ({ 
  progress, 
  size = 60, 
  strokeWidth = 4, 
  color = 'var(--accent-green)', 
  backgroundColor = 'var(--bg-secondary)',
  showPercentage = true,
  animated = true,
  className = ''
}) => {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get color based on progress
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--accent-green)';
    if (progress >= 60) return 'var(--accent-blue)';
    if (progress >= 40) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  };

  const progressColor = getProgressColor(progress);

  useEffect(() => {
    if (animated && circleRef.current) {
      const circle = circleRef.current;
      circle.style.transition = 'stroke-dashoffset 0.8s ease-in-out';
    }
  }, [animated]);

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <div style={{
          position: 'absolute',
          fontSize: size * 0.2,
          fontWeight: '600',
          color: 'var(--text-primary)',
          lineHeight: 1
        }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
