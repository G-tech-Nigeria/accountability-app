import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  User, 
  Settings as SettingsIcon,
  Plus,
  Edit3,
  X,
  Save,
  Users,
  Shield,
  Database,
  RefreshCw
} from 'lucide-react';
import { getUsers, saveUsers, getSettings, saveSettings, exportData, importData, clearAllData, resetUserProgress, calculateMissedTaskPenalties, cleanupDuplicatePenalties } from '../utils/database';
import { migrateFromLocalStorage, checkMigrationNeeded } from '../utils/migrate-data';
import { subDays } from 'date-fns';
import { onTableUpdate } from '../utils/realtime';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', avatar: '👤' });
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await loadSettings();
      setMigrationNeeded(checkMigrationNeeded());
    };
    loadData();
  }, []);

  // Real-time updates for users
  useEffect(() => {
    const unsubscribeUsers = onTableUpdate('users', async (payload) => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error updating users in Settings:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
    };
  }, []);

  const loadSettings = async () => {
    const usersData = await getUsers();
    const settingsData = await getSettings();
    
    setUsers(usersData);
    setSettings(settingsData);
  };

  const handleUpdateUser = async (userId, updates) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    await saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim()) return;
    
    const user = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newUser.name.trim(),
      avatar: newUser.avatar || '👤',
      points: 0,
      streak: 0
    };
    
    const updatedUsers = [...users, user];
    await saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setNewUser({ name: '', avatar: '👤' });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId) => {
    if (users.length <= 1) {
      alert('Cannot delete the last user. At least one user must remain.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
    }
  };

  const handleUpdateSettings = (updates) => {
    const newSettings = { ...settings, ...updates };
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accountability-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importData);
      if (importData(data)) {
        alert('Data imported successfully!');
        setShowImportDialog(false);
        setImportData('');
        loadSettings();
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    } catch (error) {
      alert('Invalid JSON format. Please check your data file.');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      alert('All data has been cleared. The app will reload.');
      window.location.reload();
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all user progress? This will clear all penalties, achievements, and reset points/streaks to 0.')) {
      if (resetUserProgress()) {
        alert('User progress has been reset successfully.');
        loadSettings();
      } else {
        alert('Failed to reset user progress.');
      }
    }
  };

  const handleRecalculatePenalties = () => {
    if (confirm('This will recalculate penalties for all missed tasks from the past 30 days. Continue?')) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let totalPenalties = 0;
        // Check last 30 days for missed tasks and calculate penalties
        for (let i = 1; i <= 30; i++) {
          const checkDate = subDays(today, i);
          const dateStr = checkDate.toISOString().split('T')[0];
          const newPenalties = calculateMissedTaskPenalties(dateStr);
          totalPenalties += newPenalties.length;
        }
        
        alert(`Penalty recalculation complete! ${totalPenalties} new penalties were calculated.`);
        loadSettings();
      } catch (error) {
        console.error('Error recalculating penalties:', error);
        alert('Failed to recalculate penalties. Please try again.');
      }
    }
  };

  const handleCleanupDuplicates = async () => {
    if (confirm('This will remove duplicate penalty records. Continue?')) {
      try {
        const removedCount = await cleanupDuplicatePenalties();
        alert(`Cleaned up ${removedCount} duplicate penalties!`);
        loadSettings();
      } catch (error) {
        console.error('Error cleaning up duplicates:', error);
        alert('Failed to clean up duplicates. Please try again.');
      }
    }
  };



  const handleMigrateData = async () => {
    if (!migrationNeeded) return;
    
    setMigrating(true);
    try {
      const result = await migrateFromLocalStorage();
      if (result.success) {
        alert(result.message);
        setMigrationNeeded(false);
        await loadSettings(); // Reload data after migration
      } else {
        alert('Migration failed: ' + result.message);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  const UserCard = ({ user }) => {
    const isEditing = editingUser?.id === user.id;
    
    return (
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)',
        padding: '1rem',
        marginBottom: '0.75rem'
      }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Name
              </label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Avatar
              </label>
              <input
                type="text"
                value={editingUser.avatar}
                onChange={(e) => setEditingUser(prev => ({ ...prev, avatar: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
                placeholder="👤"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleUpdateUser(user.id, editingUser)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  {user.points || 0} points • {user.streak || 0} day streak
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEditingUser(user)}
                style={{
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{
                  padding: '0.5rem',
                  background: 'var(--accent-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>Settings</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage users, app settings, and data
        </p>
      </div>

      {/* Users Management */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              Users Management
            </h2>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-green)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {showAddUser ? (
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '8px',
              border: '1px solid var(--sidebar-border)',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}>
                    Avatar
                  </label>
                  <input
                    type="text"
                    value={newUser.avatar}
                    onChange={(e) => setNewUser(prev => ({ ...prev, avatar: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                    placeholder="👤"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleAddUser}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--accent-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Save size={16} />
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUser(false);
                      setNewUser({ name: '', avatar: '👤' });
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          
          <div>
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Shield size={20} />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            App Settings
          </h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Penalty Amount (£)
              </label>
              <input
                type="number"
                value={settings.penaltyAmount || 5}
                onChange={(e) => handleUpdateSettings({ penaltyAmount: parseInt(e.target.value) || 5 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
                min="1"
                max="100"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Points per Completed Task
              </label>
              <input
                type="number"
                value={settings.pointsPerTask || 10}
                onChange={(e) => handleUpdateSettings({ pointsPerTask: parseInt(e.target.value) || 10 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
                min="1"
                max="100"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Points Penalty per Missed Task
              </label>
              <input
                type="number"
                value={settings.pointsPenalty || 5}
                onChange={(e) => handleUpdateSettings({ pointsPenalty: parseInt(e.target.value) || 5 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}
                min="1"
                max="100"
              />
            </div>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.autoReload === true}
                  onChange={(e) => handleUpdateSettings({ autoReload: e.target.checked })}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    cursor: 'pointer'
                  }}
                />
                Auto-reload website on database changes
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem'
              }}>
                When enabled, the website will automatically reload when any changes are made to the database. By default, real-time updates are used instead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Database size={20} />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            Data Management
          </h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <button
              onClick={handleExportData}
              style={{
                padding: '1rem',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--sidebar-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Download size={20} />
              Export Data
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              style={{
                padding: '1rem',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--sidebar-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Upload size={20} />
              Import Data
            </button>
            {migrationNeeded && (
              <button
                onClick={handleMigrateData}
                disabled={migrating}
                style={{
                  padding: '1rem',
                  background: migrating ? 'var(--text-secondary)' : 'var(--accent-blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: migrating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <RefreshCw size={20} style={{ animation: migrating ? 'spin 1s linear infinite' : 'none' }} />
                {migrating ? 'Migrating...' : 'Migrate from localStorage'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--accent-red)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Trash2 size={20} style={{ color: 'var(--accent-red)' }} />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-red)' }}>
            Danger Zone
          </h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Reset Progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--accent-orange)',
                  marginBottom: '0.25rem'
                }}>
                  Reset User Progress
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  Reset all penalties, achievements, and set points/streaks to 0. Keeps users and tasks.
                </p>
              </div>
              <button
                onClick={handleResetProgress}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-orange)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={20} />
                Reset Progress
              </button>
            </div>

            {/* Recalculate Penalties */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--accent-purple)',
                  marginBottom: '0.25rem'
                }}>
                  Recalculate Missed Task Penalties
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  This will recalculate penalties for all missed tasks from the past 30 days.
                </p>
              </div>
              <button
                onClick={handleRecalculatePenalties}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-purple)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <RefreshCw size={20} />
                Recalculate Penalties
              </button>
            </div>

            {/* Cleanup Duplicate Penalties */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--accent-orange)',
                  marginBottom: '0.25rem'
                }}>
                  Cleanup Duplicate Penalties
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  This will remove duplicate penalty records that may have been created.
                </p>
              </div>
              <button
                onClick={handleCleanupDuplicates}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-orange)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={20} />
                Cleanup Duplicates
              </button>
            </div>

            {/* Clear All Data */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--accent-red)',
                  marginBottom: '0.25rem'
                }}>
                  Clear All Data
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  This will permanently delete all tasks, penalties, achievements, and settings.
                </p>
              </div>
              <button
                onClick={handleClearData}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Trash2 size={20} />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid var(--sidebar-border)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Import Data
            </h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your exported JSON data here..."
              style={{
                width: '100%',
                height: '150px',
                padding: '1rem',
                border: '1px solid var(--sidebar-border)',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleImportData}
                disabled={!importData.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: importData.trim() ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                  color: importData.trim() ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: importData.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportData('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--sidebar-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
