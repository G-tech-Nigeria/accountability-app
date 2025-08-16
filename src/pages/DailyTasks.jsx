import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MoreHorizontal,
  ArrowRight,
  Copy,
  Camera,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getUsers, getTasks, addTask, updateTask, deleteTask, calculateMissedTaskPenalties, getDatesWithTasks, uploadProofImage, deleteProofImage, getImageUrl } from '../utils/database';
import { checkAllAchievements } from '../utils/achievements';
import { format, addDays, subDays, isToday, isYesterday } from 'date-fns';
import TaskIconSelector from '../components/TaskIconSelector';
import { onTableUpdate } from '../utils/realtime';

const DailyTasks = ({ currentDate }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', userId: '', time: '' });
  const [showAddForm, setShowAddForm] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [availableDates, setAvailableDates] = useState([]);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedTaskIcon, setSelectedTaskIcon] = useState('📝');
  const [currentSlide, setCurrentSlide] = useState(0);
  const taskTitleRefs = useRef({});
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Update selectedDate when currentDate changes (e.g., when date changes automatically)
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const loadDataAsync = async () => {
      await loadData();
      await loadAvailableDates();
    };
    loadDataAsync();
  }, [selectedDate]);

  // Check for penalties when component mounts and when date changes
  useEffect(() => {
    const calculatePenaltiesForCurrentDate = async () => {
      try {
        // Only calculate penalties for the specific date being viewed if it's in the past
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDateObj < today) {
          console.log('DailyTasks: Calculating penalties for specific date:', selectedDate);
          await calculateMissedTaskPenalties(selectedDate);
        }
      } catch (error) {
        console.error('Error calculating penalties:', error);
      }
    };
    
    calculatePenaltiesForCurrentDate();
  }, [selectedDate]);

  // Listen for achievement unlock events
  useEffect(() => {
    const handleAchievementUnlock = (event) => {
      const { achievement } = event.detail;
      setAchievementPopup(achievement);
      
      // Auto-hide popup after 5 seconds
      setTimeout(() => {
        setAchievementPopup(null);
      }, 5000);
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlock);
    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlock);
    };
  }, []);

  // Real-time updates for tasks and users
  useEffect(() => {
    const unsubscribeTasks = onTableUpdate('tasks', async (payload) => {
      // Reload tasks data
      try {
        const tasksData = await getTasks();
        const filteredTasks = tasksData.filter(task => task.date === selectedDate);
        setTasks(filteredTasks);
      } catch (err) {
        console.error('Error updating tasks in DailyTasks:', err);
      }
    });

    const unsubscribeUsers = onTableUpdate('users', async (payload) => {
      // Reload users data
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error updating users in DailyTasks:', err);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeTasks();
      unsubscribeUsers();
    };
  }, [selectedDate]);

  const loadData = async () => {
    const usersData = await getUsers();
    const tasksData = await getTasks();
    const filteredTasks = tasksData.filter(task => task.date === selectedDate);
    
    setUsers(usersData);
    setTasks(filteredTasks);
    
    // Calculate penalties for missed tasks if viewing a past date
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < today) {
      await calculateMissedTaskPenalties(selectedDate);
    }
  };

  // Function to check and calculate penalties for missed tasks
  const checkAndCalculatePenalties = async () => {
    try {
      // Use current system date (August 2025)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check last 7 days for missed tasks and calculate penalties
      for (let i = 1; i <= 7; i++) {
        const checkDate = subDays(today, i);
        const dateStr = checkDate.toISOString().split('T')[0];
        await calculateMissedTaskPenalties(dateStr);
      }
    } catch (error) {
      console.error('Error calculating penalties:', error);
    }
  };

  const loadAvailableDates = async () => {
    const dates = await getDatesWithTasks();
    setAvailableDates(dates);
  };

  const handleDateChange = async (direction) => {
    const currentDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newDate;
    
    if (direction === 'prev') {
      // Allow going to previous days
      newDate = subDays(currentDateObj, 1);
    } else {
      // Allow going to next day, but only if it's not in the future
      newDate = addDays(currentDateObj, 1);
      const nextDateString = newDate.toISOString().split('T')[0];
      const todayString = today.toISOString().split('T')[0];
      
      // Only allow if the next date is today or earlier (compare as strings)
      if (nextDateString > todayString) {
        // Don't allow going to future dates
        return;
      }
    }
    

    
    const newDateString = newDate.toISOString().split('T')[0];
    
    setSelectedDate(newDateString);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getDateDisplayText = (date) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      return 'Today';
    } else if (isYesterday(dateObj)) {
      return 'Yesterday';
    } else {
      return format(dateObj, 'EEEE, MMMM do');
    }
  };

  // Check if the selected date is in the past (read-only mode)
  const isDateInPast = () => {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDateObj < today;
  };



  const handleShowAddForm = (userId) => {
    setShowAddForm({ ...showAddForm, [userId]: true });
    // Focus the input after a short delay to ensure the form is rendered
    setTimeout(() => {
      if (taskTitleRefs.current[userId]) {
        taskTitleRefs.current[userId].focus();
      }
    }, 100);
  };

  const handleAddTask = async (userId) => {
    if (!newTask.title.trim()) return;
    
    // Prevent adding tasks to past dates only
    if (isDateInPast()) {
      alert('Cannot add tasks to past dates. Tasks can only be added to today or future dates.');
      return;
    }

    const task = {
      title: newTask.title,
      userId: userId,
      date: selectedDate,
      time: newTask.time || '',
      status: 'pending',
      description: '',
      proof: null,
      icon: selectedTaskIcon
    };

    // Add task to database
    const newTaskData = await addTask(task);
    
    // Optimistically update the UI immediately
    if (newTaskData) {
      const transformedTask = {
        ...newTaskData,
        userId: newTaskData.user_id
      };
      setTasks(prevTasks => [...prevTasks, transformedTask]);
    }
    
    // Reset form
    setNewTask({ title: '', userId: '', time: '' });
    setShowAddForm({ ...showAddForm, [userId]: false });
    
    // Check for achievements in the background (don't wait for it)
    checkAllAchievements(userId, selectedDate).catch(err => 
      console.error('Error checking achievements:', err)
    );
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Prevent toggling tasks on past dates
    if (isDateInPast()) {
      alert('Cannot modify tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    const updatedTask = {
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed'
    };

    // Optimistically update the UI immediately
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === taskId ? updatedTask : t)
    );

    // Update in database
    await updateTask(taskId, updatedTask);
    
    // Check for achievements in the background when task is completed
    if (updatedTask.status === 'completed') {
      checkAllAchievements(task.userId, selectedDate).catch(err => 
        console.error('Error checking achievements:', err)
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Prevent deleting tasks on past dates
    if (isDateInPast()) {
      alert('Cannot delete tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    // Optimistically remove from UI immediately
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    
    // Delete from database
    await deleteTask(taskId);
  };

  const handleProofUpload = async (taskId) => {
    // Prevent uploading proof on past dates
    if (isDateInPast()) {
      alert('Cannot upload proof on past dates. Tasks are read-only for previous days.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            // Show loading state
            const loadingTask = {
              ...task,
              proof: 'uploading...',
              status: 'completed'
            };
            
            // Optimistically update the UI immediately
            setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? loadingTask : t)
            );
            
            // Upload image to Supabase Storage
            const imageUrl = await uploadProofImage(file, taskId);
            
            const updatedTask = {
              ...task,
              proof: imageUrl,
              status: 'completed'
            };
            
            // Update UI with actual image URL
            setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? updatedTask : t)
            );
            
            // Update in database
            await updateTask(taskId, updatedTask);
            
            // Check for achievements in the background
            checkAllAchievements(task.userId, selectedDate).catch(err => 
              console.error('Error checking achievements:', err)
            );
          }
                 } catch (error) {
           console.error('Error uploading proof:', error);
           alert(`Failed to upload proof: ${error.message}. Please try again.`);
          
          // Revert the optimistic update
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? task : t)
            );
          }
        }
      }
    };
    
    input.click();
  };

  const handleRemoveProof = async (taskId) => {
    // Prevent removing proof on past dates
    if (isDateInPast()) {
      alert('Cannot modify tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        // Delete image from storage if it exists
        if (task.proof && task.proof !== 'uploading...') {
          await deleteProofImage(task.proof);
        }
        
      const updatedTask = {
        ...task,
        proof: null
      };
        
        // Optimistically update the UI immediately
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === taskId ? updatedTask : t)
        );
        
        // Update in database
        await updateTask(taskId, updatedTask);
      } catch (error) {
        console.error('Error removing proof:', error);
        alert('Failed to remove proof. Please try again.');
      }
    }
  };

  const getTasksForUser = (userId) => {
    return tasks.filter(task => task.userId === userId);
  };

  const getTaskCount = (userId) => {
    return getTasksForUser(userId).length;
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % users.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + users.length) % users.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Swipe gesture functions
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">{'>'}</span>
        <span>Daily Tasks</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Daily Tasks
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Date Picker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '0.5rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)'
      }}>
        <button
          onClick={() => handleDateChange('prev')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            {getDateDisplayText(selectedDate)}
          </span>

          {selectedDate !== currentDate && (
            <button
              onClick={() => setSelectedDate(currentDate)}
              style={{
                background: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Go to Today
            </button>
          )}
        </div>
        <button
          onClick={() => handleDateChange('next')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Desktop Grid Layout */}
      <div className="desktop-layout" style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
        gap: '1rem',
        minHeight: 'calc(100vh - 200px)'
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
                    {user.name} - {getTaskCount(user.id)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div style={{ marginBottom: '1rem' }}>
              {getTasksForUser(user.id).map(task => (
                <div key={task.id} style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  border: '1px solid var(--sidebar-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    {/* Checkbox */}
                    <div 
                      onClick={() => !isDateInPast() && handleToggleTask(task.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--text-muted)',
                        cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: task.status === 'completed' ? 'var(--accent-green)' : 'transparent',
                        borderColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--text-muted)',
                        flexShrink: 0,
                        opacity: isDateInPast() ? 0.5 : 1
                      }}
                    >
                      {task.status === 'completed' && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'white'
                        }} />
                      )}
                    </div>

                    {/* Task Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '1rem' }}>
                          {task.icon || '📝'}
                        </span>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                          wordWrap: 'break-word',
                          flex: 1
                      }}>
                        {task.title}
                        </div>
                      </div>
                      
                      {/* Date and Time */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: 'var(--accent-orange)',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <Calendar size={12} />
                        <span>{format(new Date(task.date), 'dd MMM')}</span>
                        {task.time && (
                          <>
                            <Clock size={12} />
                            <span>{task.time}</span>
                          </>
                        )}
                        <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                        <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                        <button
                          onClick={() => !isDateInPast() && handleDeleteTask(task.id)}
                          disabled={isDateInPast()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isDateInPast() ? 'var(--text-muted)' : 'var(--accent-red)',
                            cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                            padding: '0.25rem',
                            opacity: isDateInPast() ? 0.5 : 1
                          }}
                          title={isDateInPast() ? 'Cannot delete past tasks' : 'Delete task'}
                        >
                          <X size={12} />
                        </button>
                      </div>

                      {/* Proof of Completion */}
                      {task.proof ? (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: task.proof === 'uploading...' ? 'var(--accent-orange)' : 'var(--accent-green)',
                              fontWeight: '500'
                            }}>
                              {task.proof === 'uploading...' ? '⏳ Uploading...' : '✅ Proof uploaded'}
                            </span>
                            {task.proof !== 'uploading...' && (
                            <button
                                onClick={() => !isDateInPast() && handleRemoveProof(task.id)}
                                disabled={isDateInPast()}
                              style={{
                                background: 'none',
                                border: 'none',
                                  color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-muted)',
                                  cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                                  padding: '0.25rem',
                                  opacity: isDateInPast() ? 0.5 : 1
                              }}
                            >
                              <X size={12} />
                            </button>
                            )}
                          </div>
                          {task.proof === 'uploading...' ? (
                            <div style={{
                              width: '100%',
                              maxWidth: '200px',
                              height: '120px',
                              background: 'var(--bg-secondary)',
                              borderRadius: '6px',
                              border: '1px solid var(--sidebar-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                              fontSize: '0.75rem'
                            }}>
                              ⏳ Uploading...
                            </div>
                          ) : (
                            <img
                              src={getImageUrl(task.proof)}
                              alt="Task proof"
                              onClick={() => setSelectedImage(getImageUrl(task.proof))}
                              style={{
                              width: '100%',
                              maxWidth: '200px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid var(--sidebar-border)',
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                              onError={(e) => {
                                console.error('Failed to load image:', task.proof);
                                e.target.style.display = 'none';
                              }}
                          />
                          )}
                        </div>
                      ) : (
                        <div style={{ marginTop: '0.5rem' }}>
                          <button
                            onClick={() => !isDateInPast() && handleProofUpload(task.id)}
                            disabled={isDateInPast()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: isDateInPast() ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                              border: '1px solid var(--sidebar-border)',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              justifyContent: 'center',
                              opacity: isDateInPast() ? 0.5 : 1
                            }}
                          >
                            <Camera size={14} />
                            {isDateInPast() ? 'Read-only' : 'Upload proof'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Button */}
            <div style={{ marginTop: 'auto' }}>
              {showAddForm[user.id] ? (
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setShowIconSelector(true)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--sidebar-border)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        minWidth: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedTaskIcon}
                    </button>
                  <input
                      ref={(el) => taskTitleRefs.current[user.id] = el}
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    style={{
                        flex: 1,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(user.id)}
                  />
                  </div>
                  <input
                    type="text"
                    placeholder="Time (optional)"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAddTask(user.id)}
                      style={{
                        background: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm({ ...showAddForm, [user.id]: false })}
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--sidebar-border)',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {isDateInPast() && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-orange)',
                      textAlign: 'center',
                      marginBottom: '0.5rem',
                      padding: '0.25rem',
                      background: 'rgba(255, 165, 0, 0.1)',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 165, 0, 0.3)'
                    }}>
                      📅 Read-only mode - Past date
                    </div>
                  )}
                <button
                    onClick={() => handleShowAddForm(user.id)}
                    disabled={isDateInPast()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                      background: isDateInPast() ? 'var(--bg-secondary)' : 'none',
                    border: 'none',
                      color: isDateInPast() ? 'var(--text-secondary)' : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                      cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    width: '100%',
                      justifyContent: 'center',
                      opacity: isDateInPast() ? 0.5 : 1
                  }}
                >
                  <Plus size={16} />
                    {isDateInPast() ? 'Read-only' : 'Add task'}
                </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel Layout */}
      <div 
        ref={carouselRef}
        className="mobile-carousel" 
        style={{
          display: 'none',
          flexDirection: 'column',
          height: 'calc(100vh - 200px)',
          position: 'relative'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Carousel Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          marginBottom: '1rem',
          border: '1px solid var(--sidebar-border)'
        }}>
          <button
            onClick={prevSlide}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{users[currentSlide]?.avatar}</span>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                {users[currentSlide]?.name}
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {getTaskCount(users[currentSlide]?.id)} tasks
              </div>
            </div>
          </div>
          
          <button
            onClick={nextSlide}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {users.map((user, index) => (
            <button
              key={user.id}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentSlide ? 'var(--accent-blue)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Carousel Content */}
        <div style={{
          flex: 1,
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--sidebar-border)',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          {/* Task List for Current User */}
          <div style={{ marginBottom: '1rem' }}>
            {getTasksForUser(users[currentSlide]?.id).map(task => (
              <div key={task.id} style={{
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                border: '1px solid var(--sidebar-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  {/* Checkbox */}
                  <div 
                    onClick={() => !isDateInPast() && handleToggleTask(task.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid var(--text-muted)',
                      cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: task.status === 'completed' ? 'var(--accent-green)' : 'transparent',
                      borderColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--text-muted)',
                      flexShrink: 0,
                      opacity: isDateInPast() ? 0.5 : 1
                    }}
                  >
                    {task.status === 'completed' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'white'
                      }} />
                    )}
                  </div>

                  {/* Task Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontSize: '1rem' }}>
                        {task.icon || '📝'}
                      </span>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                        wordWrap: 'break-word',
                        flex: 1
                      }}>
                        {task.title}
                      </div>
                    </div>
                    
                    {/* Date and Time */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: 'var(--accent-orange)',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <Calendar size={12} />
                      <span>{format(new Date(task.date), 'dd MMM')}</span>
                      {task.time && (
                        <>
                          <Clock size={12} />
                          <span>{task.time}</span>
                        </>
                      )}
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                      <button
                        onClick={() => !isDateInPast() && handleDeleteTask(task.id)}
                        disabled={isDateInPast()}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isDateInPast() ? 'var(--text-muted)' : 'var(--accent-red)',
                          cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                          padding: '0.25rem',
                          opacity: isDateInPast() ? 0.5 : 1
                        }}
                        title={isDateInPast() ? 'Cannot delete past tasks' : 'Delete task'}
                      >
                        <X size={12} />
                      </button>
                    </div>

                    {/* Proof of Completion */}
                    {task.proof ? (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: task.proof === 'uploading...' ? 'var(--accent-orange)' : 'var(--accent-green)',
                            fontWeight: '500'
                          }}>
                            {task.proof === 'uploading...' ? '⏳ Uploading...' : '✅ Proof uploaded'}
                          </span>
                          {task.proof !== 'uploading...' && (
                            <button
                              onClick={() => !isDateInPast() && handleRemoveProof(task.id)}
                              disabled={isDateInPast()}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-muted)',
                                cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                                padding: '0.25rem',
                                opacity: isDateInPast() ? 0.5 : 1
                              }}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        {task.proof === 'uploading...' ? (
                          <div style={{
                            width: '100%',
                            maxWidth: '200px',
                            height: '120px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '6px',
                            border: '1px solid var(--sidebar-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem'
                          }}>
                            ⏳ Uploading...
                          </div>
                        ) : (
                          <img
                            src={getImageUrl(task.proof)}
                            alt="Task proof"
                            onClick={() => setSelectedImage(getImageUrl(task.proof))}
                            style={{
                              width: '100%',
                              maxWidth: '200px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid var(--sidebar-border)',
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            onError={(e) => {
                              console.error('Failed to load image:', task.proof);
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => !isDateInPast() && handleProofUpload(task.id)}
                          disabled={isDateInPast()}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: isDateInPast() ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                            border: '1px solid var(--sidebar-border)',
                            borderRadius: '6px',
                            padding: '0.5rem',
                            color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            justifyContent: 'center',
                            opacity: isDateInPast() ? 0.5 : 1
                          }}
                        >
                          <Camera size={14} />
                          {isDateInPast() ? 'Read-only' : 'Upload proof'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Task Button for Current User */}
          <div style={{ marginTop: 'auto' }}>
            {showAddForm[users[currentSlide]?.id] ? (
              <div style={{
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                padding: '0.75rem',
                border: '1px solid var(--sidebar-border)'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => setShowIconSelector(true)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      minWidth: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {selectedTaskIcon}
                  </button>
                  <input
                    ref={(el) => taskTitleRefs.current[users[currentSlide]?.id] = el}
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    style={{
                      flex: 1,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(users[currentSlide]?.id)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Time (optional)"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--sidebar-border)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAddTask(users[currentSlide]?.id)}
                    style={{
                      background: 'var(--accent-blue)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm({ ...showAddForm, [users[currentSlide]?.id]: false })}
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {isDateInPast() && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-orange)',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    padding: '0.25rem',
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 165, 0, 0.3)'
                  }}>
                    📅 Read-only mode - Past date
                  </div>
                )}
                <button
                  onClick={() => handleShowAddForm(users[currentSlide]?.id)}
                  disabled={isDateInPast()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isDateInPast() ? 'var(--bg-secondary)' : 'none',
                    border: 'none',
                    color: isDateInPast() ? 'var(--text-secondary)' : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    width: '100%',
                    justifyContent: 'center',
                    opacity: isDateInPast() ? 0.5 : 1
                  }}
                >
                  <Plus size={16} />
                  {isDateInPast() ? 'Read-only' : 'Add task'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={() => setSelectedImage(null)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}>
            <img
              src={selectedImage}
              alt="Task proof"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'var(--accent-red)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Task Icon Selector */}
      {showIconSelector && (
        <TaskIconSelector
          selectedIcon={selectedTaskIcon}
          onIconSelect={setSelectedTaskIcon}
          onClose={() => setShowIconSelector(false)}
        />
      )}

      {/* Achievement Popup */}
      {achievementPopup && (
        <div 
          className="achievement-popup"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            zIndex: 1000,
            minWidth: '320px',
            maxWidth: '90vw',
            width: '400px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                🏆
              </div>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Achievement Unlocked!
              </span>
            </div>
            <button
              onClick={() => setAchievementPopup(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                minHeight: '32px'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Achievement Content */}
          <div 
            className="achievement-content"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div 
              className="achievement-icon"
              style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0
              }}
            >
              {achievementPopup.icon || '🎯'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.25rem',
                lineHeight: '1.2',
                wordWrap: 'break-word'
              }}>
                {achievementPopup.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4',
                marginBottom: '0.5rem',
                wordWrap: 'break-word'
              }}>
                {achievementPopup.description}
              </p>
            </div>
          </div>

          {/* User and Points Info */}
          <div 
            className="user-points-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontSize: '1.5rem'
              }}>
                {achievementPopup.user?.avatar || '👤'}
              </span>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {achievementPopup.user?.name || 'User'}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0
            }}>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                +{achievementPopup.points || 0}
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem'
              }}>
                pts
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="progress-bar"
            style={{
              marginTop: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              height: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              height: '100%',
              width: '100%',
              animation: 'slideIn 0.5s ease-out'
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;
