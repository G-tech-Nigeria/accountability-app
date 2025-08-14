import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DailyTasks from './pages/DailyTasks';
import Achievements from './pages/Achievements';
import SettingsPage from './pages/Settings';
import Sidebar from './components/Sidebar';
import NotificationManager from './components/NotificationManager';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import ThemeSelector from './components/ThemeSelector';
import { calculateMissedTaskPenalties, getSettings } from './utils/database';
import { subDays } from 'date-fns';
import { applyTheme, loadThemePreferences, applyFont, loadFontPreference } from './utils/themes';
import { initializeRealtime, onGlobalReload, cleanupRealtime } from './utils/realtime';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Helper function to get current date in local timezone
  const getCurrentDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get date string from a Date object in local timezone
  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Force update current date on app start
  useEffect(() => {
    const today = getCurrentDateString();
    console.log('App: Initial date set to:', today);
    setCurrentDate(today);
  }, []);

  // Function to force refresh current date
  const forceRefreshDate = () => {
    const today = getCurrentDateString();
    console.log('App: Force refreshing date to:', today);
    setCurrentDate(today);
  };

    // Load theme preferences on app start
  useEffect(() => {
    const { themeName, customColors } = loadThemePreferences();
    const fontName = loadFontPreference();
    applyTheme(themeName, customColors);
    applyFont(fontName);
  }, []);

  // Initialize real-time database monitoring and auto-reload
  useEffect(() => {
    // Initialize real-time subscriptions
    initializeRealtime();

    // Set up global reload callback
    const unsubscribeReload = onGlobalReload(async (table, payload) => {
      // Check if auto-reload is enabled in settings
      try {
        const settings = await getSettings();
        if (settings.autoReload === true) { // Only reload if explicitly enabled
          // Add a small delay to ensure the database change is fully processed
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking auto-reload settings:', error);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeReload();
      cleanupRealtime();
    };
  }, []);

  // Handle PWA service worker errors
  useEffect(() => {
    const handleError = (event) => {
      // Ignore IndexedDB errors from service worker as they're usually harmless
      if (event.error && event.error.message && 
          (event.error.message.includes('IDBDatabase') || 
           event.error.message.includes('transaction'))) {
        console.warn('PWA IndexedDB error (harmless):', event.error.message);
        return;
      }
      console.error('App error:', event.error);
    };

    const handleUnhandledRejection = (event) => {
      // Ignore IndexedDB errors from service worker
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('IDBDatabase') || 
           event.reason.message.includes('transaction'))) {
        console.warn('PWA IndexedDB rejection (harmless):', event.reason.message);
        event.preventDefault();
        return;
      }
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Update current date at midnight and check for penalties
  useEffect(() => {
    try {
      const updateDate = async () => {
        const newDate = getCurrentDateString();
        
        // Only update if the date has actually changed
        if (newDate !== currentDate) {
          console.log('App: Date changed from', currentDate, 'to', newDate);
          setCurrentDate(newDate);
          
          // Check for penalties when date changes
          try {
            // Use the actual system date (August 2025)
            const today = new Date(newDate);
            today.setHours(0, 0, 0, 0);
            
            // Check last 7 days for missed tasks and calculate penalties
            for (let i = 1; i <= 7; i++) {
              const checkDate = subDays(today, i);
              const dateStr = getDateString(checkDate);
              await calculateMissedTaskPenalties(dateStr);
            }
          } catch (error) {
            console.error('Error calculating penalties in App:', error);
          }
        } else {
          // Only log this occasionally to avoid spam
          const now = new Date();
          if (now.getMinutes() === 0) { // Log only at the top of each hour
            console.log('App: Date check completed - no change detected (current date:', newDate, ')');
          }
        }
      };

      // Update immediately
      updateDate();

      // Set up interval to check for date change
      const interval = setInterval(updateDate, 60000); // Check every minute

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error in App useEffect:', err);
      setError(err.message);
    }
  }, []); // Remove currentDate dependency to prevent infinite loop

  // Close sidebar when route changes (mobile)
  const handleRouteChange = () => {
    setSidebarOpen(false);
  };



  if (error) {
    return (
      <div className="container p-6">
        <div className="card">
          <div className="card-body">
            <h1 className="text-xl font-bold text-red mb-4">Error Loading App</h1>
            <p className="text-secondary mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1001,
            background: 'var(--accent-blue)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease',
            minWidth: '48px',
            minHeight: '48px'
          }}
          title="Toggle Menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
          />
        )}

        <Sidebar 
          isOpen={sidebarOpen} 
          onRouteChange={handleRouteChange}
          onThemeClick={() => setShowThemeSelector(true)}
        />
        <div className="main-content">
                          <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard currentDate={currentDate} />} />
                  <Route path="/tasks" element={<DailyTasks currentDate={currentDate} />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
        </div>
        <NotificationManager />
        <PWAInstallPrompt />
        <OfflineIndicator />
        {showThemeSelector && (
          <ThemeSelector 
            isOpen={showThemeSelector} 
            onClose={() => setShowThemeSelector(false)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
