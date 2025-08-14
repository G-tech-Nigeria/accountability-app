import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'var(--accent-orange)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 1001,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    }}>
      <WifiOff size={16} />
      Offline Mode
    </div>
  );
};

export default OfflineIndicator;
