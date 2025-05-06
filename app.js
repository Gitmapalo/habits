
// Data storage
const STORAGE_KEY = 'modern-habit-tracker';

// Default data
const defaultData = {
  habits: [
    {
      id: 1,
      name: "Morning Meditation",
      category: "health",
      createdAt: new Date().toISOString(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0
    },
    {
      id: 2,
      name: "Read for 30 minutes",
      category: "personal",
      createdAt: new Date().toISOString(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0
    },
    {
      id: 3,
      name: "Coding Practice",
      category: "work",
      createdAt: new Date().toISOString(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0
    }
  ],
  badges: [
    {
      id: 1,
      name: "Beginner",
      description: "Complete any habit 3 times",
      icon: "🌱",
      condition: "completions",
      requiredCount: 3,
      unlocked: false
    },
    {
      id: 2,
      name: "Consistent",
      description: "Reach a 7-day streak",
      icon: "🔥",
      condition: "streak",
      requiredCount: 7,
      unlocked: false
    },
    {
      id: 3,
      name: "Master",
      description: "Reach a 30-day streak",
      icon: "🏆",
      condition: "streak",
      requiredCount: 30,
      unlocked: false
    },
    {
      id: 4,
      name: "Health Freak",
      description: "Complete 10 health habits",
      icon: "💪",
      condition: "category",
      category: "health",
      requiredCount: 10,
      unlocked: false
    },
    {
      id: 5,
      name: "Workaholic",
      description: "Complete 10 work habits",
      icon: "💼",
      condition: "category",
      category: "work",
      requiredCount: 10,
      unlocked: false
    },
    {
      id: 6,
      name: "Self-Developer",
      description: "Complete 10 personal habits",
      icon: "🧠",
      condition: "category",
      category: "personal",
      requiredCount: 10,
      unlocked: false
    }
  ],
  profile: {
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    notifications: []
  },
  quotes: [
    { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Your habits will determine your future.", author: "Jack Canfield" }
  ]
};

// Load data from localStorage or use default
let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

// Save data to localStorage
const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
};

// DOM Elements
const tabLinks = document.querySelectorAll('[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const habitsList = document.getElementById('habit-list');
const addHabitForm = document.getElementById('add-habit-form');
const calendarGrid = document.getElementById('calendar-grid');
const calendarMonthEl = document.getElementById('calendar-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const calendarHabitSelect = document.getElementById('calendar-habit');
const badgesContainer = document.getElementById('badges-container');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');
const notificationBell = document.getElementById('notification-bell');
const notificationPanel = document.getElementById('notification-panel');
const notificationList = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const markAllReadBtn = document.getElementById('mark-all-read');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const toastContainer = document.getElementById('toast-container');
const analyticsStats = document.getElementById('analytics-stats');
const overviewStats = document.getElementById('overview-stats');
const completionChart = document.getElementById('completion-chart');
const donutPercent = document.getElementById('donut-percent');
const categoryLegend = document.getElementById('category-legend');
const habitPerformance = document.getElementById('habit-performance');

// Mobile sidebar functionality
mobileMenuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  mobileOverlay.classList.toggle('active');
});

mobileOverlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  mobileOverlay.classList.remove('active');
});

// Notification panel
notificationBell.addEventListener('click', (e) => {
  e.stopPropagation();
  notificationPanel.classList.toggle('active');
  
  // If panel is open, mark notifications as read
  if (notificationPanel.classList.contains('active')) {
    markNotificationsAsRead();
  }
});

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
  if (!notificationPanel.contains(e.target) && e.target !== notificationBell) {
    notificationPanel.classList.remove('active');
  }
});

// Mark all notifications as read
markAllReadBtn.addEventListener('click', () => {
  markNotificationsAsRead();
  showToast('All notifications marked as read');
});

// Date utils
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const isSameDay = (date1, date2) => {
  return formatDate(new Date(date1)) === formatDate(new Date(date2));
};

// Format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Tab functionality
tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    const tabName = link.getAttribute('data-tab');
    
    // Update active tab button
    tabLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Close mobile sidebar
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    
    // Refresh content based on active tab
    if (tabName === 'habits') {
      renderHabits();
      updateOverviewStats();
    } else if (tabName === 'calendar') {
      renderCalendarHabits();
      renderCalendar();
    } else if (tabName === 'analytics') {
      renderAnalytics();
    } else if (tabName === 'achievements') {
      renderBadges();
    }
  });
});

// Show toast notification
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'check_circle' : 'error';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <span class="material-icons">${icon}</span>
    </div>
    <div class="toast-content">
      <div class="toast-title">${type === 'success' ? 'Success' : 'Error'}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">
      <span class="material-icons">close</span>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
};

// Generate random quote
const updateQuote = () => {
  const randomIndex = Math.floor(Math.random() * appData.quotes.length);
  const quote = appData.quotes[randomIndex];
  
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = `― ${quote.author}`;
};

// Add a notification
const addNotification = (message, isUnread = true) => {
  const notification = {
    id: Date.now().toString(),
    message: message,
    createdAt: new Date().toISOString(),
    read: !isUnread
  };
  
  appData.profile.notifications.unshift(notification);
  saveData();
  updateNotificationsUI();
};

// Update notifications UI
const updateNotificationsUI = () => {
  const unreadCount = appData.profile.notifications.filter(n => !n.read).length;
  
  if (unreadCount > 0) {
    notificationCount.textContent = unreadCount > 9 ? '9+' : unreadCount;
    notificationCount.style.display = 'flex';
  } else {
    notificationCount.style.display = 'none';
  }
  
  // Render notifications list
  notificationList.innerHTML = '';
  
  if (appData.profile.notifications.length === 0) {
    notificationList.innerHTML = '<div class="notification-item">No notifications yet</div>';
    return;
  }
  
  appData.profile.notifications.slice(0, 10).forEach(notification => {
    const notificationEl = document.createElement('div');
    notificationEl.className = `notification-item ${notification.read ? '' : 'unread'}`;
    
    notificationEl.innerHTML = `
      <div class="notification-icon">
        <span class="material-icons">notifications</span>
      </div>
      <div class="notification-content">
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${formatRelativeTime(notification.createdAt)}</div>
      </div>
    `;
    
    notificationList.appendChild(notificationEl);
  });
};

// Mark notifications as read
const markNotificationsAsRead = () => {
  appData.profile.notifications.forEach(notification => {
    notification.read = true;
  });
  
  saveData();
  updateNotificationsUI();
};

// Render habits list
const renderHabits = () => {
  habitsList.innerHTML = '';
  
  if (appData.habits.length === 0) {
    habitsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <span class="material-icons">task</span>
        </div>
        <div class="empty-state-text">You haven't added any habits yet</div>
        <button id="add-sample-habits">Add Sample Habits</button>
      </div>
    `;
    document.getElementById('add-sample-habits').addEventListener('click', () => {
      appData.habits = defaultData.habits;
      saveData();
      renderHabits();
      showToast('Sample habits added');
    });
    return;
  }
  
  appData.habits.forEach(habit => {
    const today = formatDate(new Date());
    const completedToday = habit.completions.some(date => 
      isSameDay(date, today)
    );
    
    const habitEl = document.createElement('div');
    habitEl.className = 'habit-item';
    habitEl.innerHTML = `
      <div class="habit-header">
        <div>
          <div class="habit-title">${habit.name}</div>
          <span class="habit-category ${habit.category}">${habit.category}</span>
        </div>
        <div class="habit-actions">
          <button class="habit-action-btn" data-action="delete" data-id="${habit.id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
      <div class="streak-info">
        <span class="streak-count">
          <span class="streak-flame">🔥</span> ${habit.currentStreak}
        </span>
        day streak
      </div>
      <button class="complete-habit-btn ${completedToday ? 'button-secondary' : ''}" 
        data-id="${habit.id}" ${completedToday ? 'disabled' : ''}>
        ${completedToday ? 'Completed Today' : 'Mark Complete'}
      </button>
    `;
    
    habitsList.appendChild(habitEl);
    
    // Add event listener for completing habit
    const completeBtn = habitEl.querySelector('.complete-habit-btn');
    completeBtn.addEventListener('click', () => {
      completeHabit(habit.id);
    });
    
       // Add event listener for deleting habit
       const deleteBtn = habitEl.querySelector('[data-action="delete"]');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHabit(habit.id);
    });
  });
};

// Add a new habit
addHabitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nameInput = document.getElementById('habit-name');
  const categoryInput = document.getElementById('habit-category');
  
  const newHabit = {
    id: Date.now(),
    name: nameInput.value,
    category: categoryInput.value,
    createdAt: new Date().toISOString(),
    completions: [],
    currentStreak: 0,
    longestStreak: 0
  };
  
  appData.habits.push(newHabit);
  saveData();
  
  nameInput.value = '';
  categoryInput.value = 'health';
  
  renderHabits();
  updateCalendarHabitSelect();
  updateOverviewStats();
  checkBadges();
  
  showToast(`Habit "${newHabit.name}" created successfully!`);
});

// Delete a habit
const deleteHabit = (habitId) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    const habitName = appData.habits.find(h => h.id === habitId)?.name;
    appData.habits = appData.habits.filter(h => h.id !== habitId);
    saveData();
    renderHabits();
    updateCalendarHabitSelect();
    updateOverviewStats();
    
    showToast(`Habit "${habitName}" deleted`);
  }
};

// Mark a habit as complete
const completeHabit = (habitId) => {
  const habitIndex = appData.habits.findIndex(h => h.id === habitId);
  if (habitIndex === -1) return;
  
  const habit = appData.habits[habitIndex];
  const today = formatDate(new Date());
  
  // Check if already completed today
  if (habit.completions.some(date => isSameDay(date, today))) {
    return;
  }
  
  // Add completion
  habit.completions.push(today);
  
  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);
  
  const completedYesterday = habit.completions.some(date => 
    isSameDay(date, yesterdayStr)
  );
  
  if (completedYesterday) {
    habit.currentStreak += 1;
  } else {
    habit.currentStreak = 1;
  }
  
  // Update longest streak
  if (habit.currentStreak > habit.longestStreak) {
    habit.longestStreak = habit.currentStreak;
  }
  
  appData.habits[habitIndex] = habit;
  saveData();
  
  // Check badges
  checkBadges();
  
  // Refresh UI
  renderHabits();
  updateOverviewStats();
  
  showToast(`Completed "${habit.name}"! 🎉`);
};

// Check for unlocked badges
const checkBadges = () => {
  let badgesUnlocked = false;
  
  // Check "Beginner" badge
  const beginnerBadge = appData.badges.find(b => b.id === 1);
  if (beginnerBadge && !beginnerBadge.unlocked) {
    // Check if any habit has at least 3 completions
    const anyHabitWithCompletions = appData.habits.some(h => h.completions.length >= 3);
    
    if (anyHabitWithCompletions) {
      beginnerBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${beginnerBadge.name}" badge! 🎉`);
    }
  }
  
  // Check "Consistent" badge
  const consistentBadge = appData.badges.find(b => b.id === 2);
  if (consistentBadge && !consistentBadge.unlocked) {
    // Check if any habit has a 7-day streak
    const anyHabitWithStreak = appData.habits.some(h => h.currentStreak >= 7 || h.longestStreak >= 7);
    
    if (anyHabitWithStreak) {
      consistentBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${consistentBadge.name}" badge! 🔥`);
    }
  }
  
  // Check "Master" badge
  const masterBadge = appData.badges.find(b => b.id === 3);
  if (masterBadge && !masterBadge.unlocked) {
    // Check if any habit has a 30-day streak
    const anyHabitWithLongStreak = appData.habits.some(h => h.currentStreak >= 30 || h.longestStreak >= 30);
    
    if (anyHabitWithLongStreak) {
      masterBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${masterBadge.name}" badge! 🏆`);
    }
  }
  
  // Check category-specific badges
  const healthBadge = appData.badges.find(b => b.id === 4);
  if (healthBadge && !healthBadge.unlocked) {
    // Count completions for health habits
    const healthCompletions = appData.habits
      .filter(h => h.category === 'health')
      .reduce((sum, h) => sum + h.completions.length, 0);
    
    if (healthCompletions >= 10) {
      healthBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${healthBadge.name}" badge! 💪`);
    }
  }
  
  const workBadge = appData.badges.find(b => b.id === 5);
  if (workBadge && !workBadge.unlocked) {
    // Count completions for work habits
    const workCompletions = appData.habits
      .filter(h => h.category === 'work')
      .reduce((sum, h) => sum + h.completions.length, 0);
    
    if (workCompletions >= 10) {
      workBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${workBadge.name}" badge! 💼`);
    }
  }
  
  const personalBadge = appData.badges.find(b => b.id === 6);
  if (personalBadge && !personalBadge.unlocked) {
    // Count completions for personal habits
    const personalCompletions = appData.habits
      .filter(h => h.category === 'personal')
      .reduce((sum, h) => sum + h.completions.length, 0);
    
    if (personalCompletions >= 10) {
      personalBadge.unlocked = true;
      badgesUnlocked = true;
      addNotification(`You've earned the "${personalBadge.name}" badge! 🧠`);
    }
  }
  
  if (badgesUnlocked) {
    saveData();
  }
};

// Calendar functionality
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const updateCalendarHeader = () => {
  const options = { month: 'long', year: 'numeric' };
  calendarMonthEl.textContent = new Date(currentYear, currentMonth).toLocaleDateString(undefined, options);
};

const renderCalendar = () => {
  updateCalendarHeader();
  calendarGrid.innerHTML = '';
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Add empty cells for days before first day of month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day inactive';
    calendarGrid.appendChild(emptyCell);
  }
  
  const selectedHabitId = parseInt(calendarHabitSelect.value);
  const selectedHabit = appData.habits.find(h => h.id === selectedHabitId);
  
  // Create a cell for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = formatDate(date);
    const isToday = isSameDay(date, new Date());
    
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
    dayCell.className = 'calendar-day';
    
    if (isToday) {
      dayCell.style.border = '2px solid var(--purple-primary)';
    }
    
    // Check if habit was completed on this day
    if (selectedHabit) {
      const completed = selectedHabit.completions.some(d => 
        isSameDay(d, dateStr)
      );
      
      if (completed) {
        dayCell.classList.add('completed');
      } else if (date < new Date() && !completed) {
        dayCell.classList.add('missed');
      }
    }
    
    calendarGrid.appendChild(dayCell);
  }
};

// Calendar navigation
prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Populate the habit select dropdown for the calendar view
const updateCalendarHabitSelect = () => {
  calendarHabitSelect.innerHTML = '';
  
  if (appData.habits.length === 0) {
    calendarHabitSelect.innerHTML = '<option value="">No habits available</option>';
    return;
  }
  
  appData.habits.forEach(habit => {
    const option = document.createElement('option');
    option.value = habit.id;
    option.textContent = habit.name;
    calendarHabitSelect.appendChild(option);
  });
  
  // Trigger calendar rendering when habit is selected
  calendarHabitSelect.addEventListener('change', renderCalendar);
};

const renderCalendarHabits = () => {
  updateCalendarHabitSelect();
};

// Update overview stats
const updateOverviewStats = () => {
  // Calculate stats
  const totalCompletions = appData.habits.reduce((sum, h) => sum + h.completions.length, 0);
  const activeHabits = appData.habits.length;
  const completedToday = appData.habits.filter(h => {
    const today = formatDate(new Date());
    return h.completions.some(date => isSameDay(date, today));
  }).length;
  
  const highestStreak = Math.max(...appData.habits.map(h => h.longestStreak), 0);
  
  // Update overview stats
  overviewStats.innerHTML = `
    <div class="analytics-stat">
      <div class="analytics-stat-title">Total Habits</div>
      <div class="analytics-stat-value">${activeHabits}</div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Completed Today</div>
      <div class="analytics-stat-value">${completedToday}/${activeHabits}</div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Total Completions</div>
      <div class="analytics-stat-value">${totalCompletions}</div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Highest Streak</div>
      <div class="analytics-stat-value">${highestStreak} days</div>
    </div>
  `;
};

// Render analytics
const renderAnalytics = () => {
  const totalHabits = appData.habits.length;
  const totalCompletions = appData.habits.reduce((sum, h) => sum + h.completions.length, 0);
  
  // Calculate stats for last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return formatDate(date);
  });
  
  const totalPossible = totalHabits * 30;
  const totalLast30Days = appData.habits.reduce((sum, h) => {
    return sum + h.completions.filter(date => last30Days.includes(date)).length;
  }, 0);
  
  const completionRate = totalPossible > 0 
    ? Math.round((totalLast30Days / totalPossible) * 100) 
    : 0;
  
  // Calculate category distribution
  const categoryDistribution = {};
  appData.habits.forEach(habit => {
    categoryDistribution[habit.category] = (categoryDistribution[habit.category] || 0) + 1;
  });
  
  // Calculate streak data
  const averageStreak = totalHabits > 0
    ? Math.round(appData.habits.reduce((sum, h) => sum + h.currentStreak, 0) / totalHabits)
    : 0;
  
  const highestStreak = Math.max(...appData.habits.map(h => h.longestStreak), 0);
  
  // Render analytics stats
  analyticsStats.innerHTML = `
    <div class="analytics-stat">
      <div class="analytics-stat-title">Completion Rate</div>
      <div class="analytics-stat-value">${completionRate}%</div>
      <div class="analytics-stat-change positive">
        <span class="material-icons">trending_up</span> Last 30 days
      </div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Active Habits</div>
      <div class="analytics-stat-value">${totalHabits}</div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Avg. Streak</div>
      <div class="analytics-stat-value">${averageStreak} days</div>
    </div>
    
    <div class="analytics-stat">
      <div class="analytics-stat-title">Highest Streak</div>
              <div class="analytics-stat-title">Highest Streak</div>
      <div class="analytics-stat-value">${highestStreak} days</div>
    </div>
  `;
  
  // Render completion chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date,
      dateStr: formatDate(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });
  
  // Calculate completions for each day
  const dailyCompletions = last7Days.map(day => {
    const completed = appData.habits.reduce((sum, h) => {
      return sum + (h.completions.some(date => isSameDay(date, day.dateStr)) ? 1 : 0);
    }, 0);
    
    return {
      day: day.label,
      completed: completed,
      total: totalHabits,
      percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0
    };
  });
  
  // Render completion chart
  completionChart.innerHTML = '';
  
  dailyCompletions.forEach(day => {
    const barContainer = document.createElement('div');
    barContainer.className = 'completion-bar';
    
    const barFill = document.createElement('div');
    barFill.className = 'completion-bar-fill';
    barFill.style.height = `${day.percentage}%`;
    
    const barLabel = document.createElement('div');
    barLabel.className = 'completion-bar-label';
    barLabel.textContent = day.day;
    
    barContainer.appendChild(barFill);
    barContainer.appendChild(barLabel);
    completionChart.appendChild(barContainer);
  });
  
  // Update donut chart
  donutPercent.textContent = `${completionRate}%`;
  
  // Calculate percentages for category distribution
  const categoryPercentages = {};
  const categoryColors = {
    'health': '#10B981',
    'work': '#3B82F6',
    'personal': '#8B5CF6',
    'learning': '#F59E0B',
    'social': '#EF4444'
  };
  
  let totalHabitsCount = 0;
  Object.values(categoryDistribution).forEach(count => {
    totalHabitsCount += count;
  });
  
  Object.entries(categoryDistribution).forEach(([category, count]) => {
    categoryPercentages[category] = Math.round((count / totalHabitsCount) * 100);
  });
  
  // Generate CSS for conic gradient
  let conicGradient = 'conic-gradient(';
  let currentAngle = 0;
  
  Object.entries(categoryPercentages).forEach(([category, percentage], index) => {
    const nextAngle = currentAngle + percentage;
    conicGradient += `${categoryColors[category]} ${currentAngle}% ${nextAngle}%${index < Object.keys(categoryPercentages).length - 1 ? ',' : ''}`;
    currentAngle = nextAngle;
  });
  
  conicGradient += ')';
  
  // Apply conic gradient to donut chart
  document.querySelector('.chart-donut').style.background = conicGradient;
  
  // Render category legend
  categoryLegend.innerHTML = '';
  
  Object.entries(categoryPercentages).forEach(([category, percentage]) => {
    const legendItem = document.createElement('div');
    legendItem.className = 'chart-legend-item';
    
    legendItem.innerHTML = `
      <div class="chart-legend-color" style="background-color: ${categoryColors[category]}"></div>
      <span>${category} (${percentage}%)</span>
    `;
    
    categoryLegend.appendChild(legendItem);
  });
  
  // Render habit performance
  habitPerformance.innerHTML = '';
  
  if (appData.habits.length === 0) {
    habitPerformance.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-text">Add habits to see performance metrics</div>
      </div>
    `;
    return;
  }
  
  const habitTable = document.createElement('table');
  habitTable.className = 'w-full';
  habitTable.style.borderCollapse = 'collapse';
  habitTable.style.width = '100%';
  
  habitTable.innerHTML = `
    <thead>
      <tr>
        <th style="text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">Habit</th>
        <th style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">Category</th>
        <th style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">Streak</th>
        <th style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">Completions</th>
        <th style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">Success Rate</th>
      </tr>
    </thead>
    <tbody>
      ${appData.habits.map(habit => {
        const daysSinceCreation = Math.round((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)) + 1;
        const successRate = daysSinceCreation > 0 
          ? Math.round((habit.completions.length / daysSinceCreation) * 100) 
          : 0;
        
        return `
          <tr>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">${habit.name}</td>
            <td style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">
              <span class="habit-category ${habit.category}" style="display: inline-block;">${habit.category}</span>
            </td>
            <td style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">
              ${habit.currentStreak} days
            </td>
            <td style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">
              ${habit.completions.length}
            </td>
            <td style="text-align: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-200);">
              ${successRate}%
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;
  
  habitPerformance.appendChild(habitTable);
};

// Render badges
const renderBadges = () => {
  badgesContainer.innerHTML = '';
  
  appData.badges.forEach(badge => {
    const badgeEl = document.createElement('div');
    badgeEl.className = `badge ${badge.unlocked ? 'unlocked' : 'locked'}`;
    badgeEl.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.description}</div>
    `;
    
    badgesContainer.appendChild(badgeEl);
  });
};

// Initialize app
const initApp = () => {
  // Set user info
  userName.textContent = appData.profile.name;
  userAvatar.src = appData.profile.avatar;
  
  // Load random quote
  updateQuote();
  
  // Render UI components
  renderHabits();
  updateCalendarHabitSelect();
  renderCalendar();
  updateOverviewStats();
  renderBadges();
  updateNotificationsUI();
  
  // Show welcome toast
  setTimeout(() => {
    showToast('Welcome to your Habit Tracker! 👋');
  }, 500);
};



// Start the app
initApp();








