import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarDays,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
  GraduationCap,
  Timer,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Data Structures: AVL Tree Implementation',
    subject: 'Computer Science',
    deadline: '2026-11-12',
    difficulty: 'Hard',
    type: 'Assignment',
    completed: false,
    estimatedHours: 4,
  },
  {
    id: '2',
    title: 'Macroeconomics Midterm Review',
    subject: 'Economics',
    deadline: '2026-11-14',
    difficulty: 'Medium',
    type: 'Exam',
    completed: false,
    estimatedHours: 5,
  },
  {
    id: '3',
    title: 'Cognitive Psychology: Read Chapter 6 & 7',
    subject: 'Psychology',
    deadline: '2026-11-10',
    difficulty: 'Easy',
    type: 'Reading',
    completed: true,
    estimatedHours: 2,
  },
  {
    id: '4',
    title: 'Linear Algebra Problem Set 5',
    subject: 'Mathematics',
    deadline: '2026-11-16',
    difficulty: 'Hard',
    type: 'Assignment',
    completed: false,
    estimatedHours: 3.5,
  },
  {
    id: '5',
    title: 'Software Engineering Group Project Milestone 2',
    subject: 'Computer Science',
    deadline: '2026-11-19',
    difficulty: 'Medium',
    type: 'Project',
    completed: false,
    estimatedHours: 6,
  },
  {
    id: '6',
    title: 'World History Quiz 3 prep',
    subject: 'History',
    deadline: '2026-11-11',
    difficulty: 'Easy',
    type: 'Quiz',
    completed: true,
    estimatedHours: 1.5,
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('studyflow_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  const [toasts, setToasts] = useState([]);

  // Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    deadline: '',
    difficulty: 'Medium',
    type: 'Assignment',
    estimatedHours: 2,
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter & Search states in My Tasks
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 10, 9)); // Nov 2026

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    // default to today or tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    setFormData({
      title: '',
      subject: '',
      deadline: dateStr,
      difficulty: 'Medium',
      type: 'Assignment',
      estimatedHours: 2,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      difficulty: task.difficulty,
      type: task.type,
      estimatedHours: task.estimatedHours || 2,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.deadline) {
      errors.deadline = 'Due date is required';
    }
    if (formData.estimatedHours <= 0) {
      errors.estimatedHours = 'Estimated hours must be greater than 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'danger');
      return;
    }

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...formData,
                estimatedHours: Number(formData.estimatedHours),
              }
            : t
        )
      );
      showToast('Task updated successfully', 'success');
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        estimatedHours: Number(formData.estimatedHours),
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('New task added', 'success');
    }
    setIsModalOpen(false);
  };

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextState = !task.completed;
          showToast(
            nextState ? 'Task marked as completed! 🎯' : 'Task marked incomplete',
            nextState ? 'success' : 'info'
          );
          return { ...task, completed: nextState };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted', 'info');
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const upcomingTasks = tasks.filter((t) => !t.completed).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Subjects list for filter
  const allSubjects = useMemo(() => {
    const subs = new Set(tasks.map((t) => t.subject.trim()));
    return Array.from(subs).filter(Boolean);
  }, [tasks]);

  // Priority tasks: upcoming tasks sorted by deadline
  const priorityTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
  }, [tasks]);

  // Tasks categorized by type
  const taskTypeBreakdown = useMemo(() => {
    const counts = {};
    tasks.forEach((t) => {
      counts[t.type] = (counts[t.type] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  // Filtered tasks for My Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        filterSubject === 'All' || task.subject === filterSubject;
      const matchesType = filterType === 'All' || task.type === filterType;
      const matchesDifficulty =
        filterDifficulty === 'All' || task.difficulty === filterDifficulty;
      const matchesStatus =
        filterStatus === 'All'
          ? true
          : filterStatus === 'Completed'
          ? task.completed
          : !task.completed;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesType &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    tasks,
    searchQuery,
    filterSubject,
    filterType,
    filterDifficulty,
    filterStatus,
  ]);

  // Smart Planner recommendations
  const smartSchedule = useMemo(() => {
    const uncompleted = tasks.filter((t) => !t.completed);
    // Score tasks by urgency (days left) and difficulty
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scored = uncompleted.map((task) => {
      const dueDate = new Date(task.deadline);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let difficultyMultiplier = 1;
      if (task.difficulty === 'Hard') difficultyMultiplier = 2.5;
      else if (task.difficulty === 'Medium') difficultyMultiplier = 1.6;
      else difficultyMultiplier = 1.0;

      // Lower diffDays means higher urgency
      const urgencyScore = Math.max(1, 14 - diffDays) * difficultyMultiplier;

      // Recommended focus block
      let sessionLength = '45 mins';
      let sessionTip = 'Break down into quick manageable sub-tasks.';
      if (task.difficulty === 'Hard') {
        sessionLength = '90 mins Deep Work';
        sessionTip = 'Block off distractions. Tackle the most challenging concepts first.';
      } else if (task.difficulty === 'Medium') {
        sessionLength = '50 mins Focus Session';
        sessionTip = 'Use Pomodoro technique with a 10 min break.';
      } else {
        sessionLength = '30 mins Rapid Review';
        sessionTip = 'Ideal for low cognitive load or evening wind-down.';
      }

      return {
        ...task,
        diffDays,
        urgencyScore,
        sessionLength,
        sessionTip,
      };
    });

    return scored.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [tasks]);

  // Calendar Helpers
  const currentMonthYear = calendarDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthDays - x + 1;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateString = prevDate.toISOString().split('T')[0];
      days.push({
        dateNumber: dayNum,
        dateString,
        isCurrentMonth: false,
        tasks: tasks.filter((t) => t.deadline === dateString),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      // Ensure local date string matches YYYY-MM-DD
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      const dateString = `${yStr}-${mStr}-${dStr}`;

      const isToday =
        new Date().toISOString().split('T')[0] === dateString;

      days.push({
        dateNumber: i,
        dateString,
        isCurrentMonth: true,
        isToday,
        tasks: tasks.filter((t) => t.deadline === dateString),
      });
    }

    // Next month padding to round up to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextDate = new Date(year, month + 1, j);
      const dateString = nextDate.toISOString().split('T')[0];
      days.push({
        dateNumber: j,
        dateString,
        isCurrentMonth: false,
        tasks: tasks.filter((t) => t.deadline === dateString),
      });
    }

    return days;
  }, [calendarDate, tasks]);

  const prevMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1)
    );
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'hard':
        return <span className="badge badge-hard">Hard</span>;
      case 'medium':
        return <span className="badge badge-medium">Medium</span>;
      case 'easy':
        return <span className="badge badge-easy">Easy</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    const lower = type.toLowerCase();
    let badgeClass = 'badge-assignment';
    if (lower.includes('exam')) badgeClass = 'badge-exam';
    else if (lower.includes('reading')) badgeClass = 'badge-reading';
    else if (lower.includes('project')) badgeClass = 'badge-project';
    else if (lower.includes('quiz')) badgeClass = 'badge-quiz';

    return <span className={`badge ${badgeClass}`}>{type}</span>;
  };

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <GraduationCap size={24} color="#1e293b" />
          <span>StudyFlow</span>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <h1>StudyFlow</h1>
            <span>Academic Sync</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setMobileMenuOpen(false);
            }}
          >
            <LayoutDashboard size={19} />
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tasks');
              setMobileMenuOpen(false);
            }}
          >
            <CheckSquare size={19} />
            My Tasks
          </button>
          <button
            className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('planner');
              setMobileMenuOpen(false);
            }}
          >
            <Sparkles size={19} />
            Smart Planner
          </button>
          <button
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('calendar');
              setMobileMenuOpen(false);
            }}
          >
            <CalendarIcon size={19} />
            Calendar
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="user-avatar">AL</div>
            <div className="user-info">
              <span className="user-name">Alex Lawrence</span>
              <span className="user-role">Semester 4 • Dean's List</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <main className="main-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="page-header">
                <div className="header-titles">
                  <h2>Welcome back, Alex 👋</h2>
                  <p className="header-subtitle">{todayFormatted} — You're making steady academic progress.</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    <Plus size={16} />
                    New Task
                  </button>
                </div>
              </div>

              {/* Top Key Metrics */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div
                    className="stat-icon-wrapper"
                    style={{ background: '#f1f5f9', color: '#1e293b' }}
                  >
                    <BookOpen size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{totalTasks}</span>
                    <span className="stat-label">Total Tasks</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div
                    className="stat-icon-wrapper"
                    style={{ background: '#ecfdf5', color: '#059669' }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{completedTasks}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div
                    className="stat-icon-wrapper"
                    style={{ background: '#fffbeb', color: '#d97706' }}
                  >
                    <Clock size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{upcomingTasks}</span>
                    <span className="stat-label">Upcoming Due</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div
                    className="stat-icon-wrapper"
                    style={{ background: '#eff6ff', color: '#2563eb' }}
                  >
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{completionPercentage}%</span>
                    <span className="stat-label">Completion Rate</span>
                  </div>
                </div>
              </div>

              {/* Overall Progress Bar Card */}
              <div className="overview-progress-card">
                <div className="overview-progress-header">
                  <div>
                    <h3>Weekly Study Milestone</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
                      {completedTasks} of {totalTasks} academic requirements accomplished
                    </p>
                  </div>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="progress-subtext">
                  {completionPercentage >= 75
                    ? '🎉 Phenomenal work! You are ahead of schedule for your courses.'
                    : completionPercentage >= 50
                    ? '⚡ Halfway there! Keep up the focus on this week\'s high priority tasks.'
                    : '📖 A productive study week awaits. Check your Smart Planner to optimize focus blocks.'}
                </div>
              </div>

              {/* Split Dashboard Content */}
              <div className="dashboard-grid">
                {/* Priority Tasks */}
                <div className="card">
                  <div className="card-title">
                    <span>🔥 Priority & Urgently Due</span>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setActiveTab('tasks')}
                      style={{ fontSize: '0.8rem' }}
                    >
                      View all ({upcomingTasks})
                    </button>
                  </div>

                  {priorityTasks.length === 0 ? (
                    <div className="empty-state">
                      <CheckCircle2 size={36} color="#10b981" />
                      <h4>All caught up!</h4>
                      <p>You have no pending urgent tasks.</p>
                    </div>
                  ) : (
                    priorityTasks.map((task) => (
                      <div key={task.id} className="task-item">
                        <div className="task-left">
                          <button
                            className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
                            onClick={() => handleToggleComplete(task.id)}
                            aria-label="Toggle task status"
                          >
                            {task.completed && <Check size={14} />}
                          </button>
                          <div className="task-details">
                            <span className="task-title">{task.title}</span>
                            <div className="task-meta">
                              <span className="meta-subject">{task.subject}</span>
                              <span>•</span>
                              <span>Due {task.deadline}</span>
                              {getTypeBadge(task.type)}
                              {getDifficultyBadge(task.difficulty)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Categorized Breakdown */}
                <div className="card">
                  <div className="card-title">
                    <span>Tasks by Category</span>
                  </div>

                  <div className="category-list">
                    {['Assignment', 'Exam', 'Reading', 'Project', 'Quiz'].map((cat) => {
                      const count = taskTypeBreakdown[cat] || 0;
                      return (
                        <div key={cat} className="category-row">
                          <div className="category-row-info">
                            {getTypeBadge(cat)}
                            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                              {cat}s
                            </span>
                          </div>
                          <span className="category-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY TASKS */}
          {activeTab === 'tasks' && (
            <div>
              <div className="page-header">
                <div className="header-titles">
                  <h2>My Course Tasks</h2>
                  <p className="header-subtitle">
                    Manage assignments, exams, readings, and group projects.
                  </p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="tasks-toolbar">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by title or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select
                    className="filter-select"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                  >
                    <option value="All">All Subjects</option>
                    {allSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>

                  <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam</option>
                    <option value="Reading">Reading</option>
                    <option value="Project">Project</option>
                    <option value="Quiz">Quiz</option>
                  </select>

                  <select
                    className="filter-select"
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Task Items List */}
              <div className="card">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <BookOpen size={40} />
                    <h4>No tasks found</h4>
                    <p>Try clearing some filters or add a new course task.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-item ${task.completed ? 'completed' : ''}`}
                    >
                      <div className="task-left">
                        <button
                          className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
                          onClick={() => handleToggleComplete(task.id)}
                          aria-label="Toggle completion"
                        >
                          {task.completed && <Check size={14} />}
                        </button>
                        <div className="task-details">
                          <span className="task-title">{task.title}</span>
                          <div className="task-meta">
                            <span className="meta-subject">{task.subject}</span>
                            <span>•</span>
                            <span>Due {task.deadline}</span>
                            <span>•</span>
                            <span>~{task.estimatedHours} hrs</span>
                            {getTypeBadge(task.type)}
                            {getDifficultyBadge(task.difficulty)}
                          </div>
                        </div>
                      </div>

                      <div className="task-right">
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleOpenEditModal(task)}
                          title="Edit Task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete Task"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SMART PLANNER */}
          {activeTab === 'planner' && (
            <div>
              <div className="page-header">
                <div className="header-titles">
                  <h2>Smart Study Planner</h2>
                  <p className="header-subtitle">
                    Intelligently prioritized study sessions generated from your deadlines and cognitive difficulty.
                  </p>
                </div>
              </div>

              <div className="planner-hero">
                <div className="planner-hero-info">
                  <h3>Adaptive Study Recommendation Engine</h3>
                  <p>
                    Tasks are scored dynamically: upcoming deadlines combined with challenging subjects (Hard/Medium) receive prioritized focus blocks and optimal break intervals.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => showToast('Planner refreshed with latest task inputs', 'info')}
                >
                  <Sparkles size={16} />
                  Re-Optimize Schedule
                </button>
              </div>

              {smartSchedule.length === 0 ? (
                <div className="card empty-state">
                  <CheckCircle2 size={44} color="#10b981" />
                  <h4>No pending sessions needed!</h4>
                  <p>All your tasks are completed. Relax or schedule ahead for upcoming weeks.</p>
                </div>
              ) : (
                <div className="session-cards-grid">
                  {smartSchedule.map((item, index) => (
                    <div key={item.id} className="session-card">
                      <div>
                        <div className="session-top">
                          <span className="session-duration">
                            <Timer size={14} />
                            {item.sessionLength}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: item.diffDays <= 2 ? '#e11d48' : '#64748b',
                            }}
                          >
                            {item.diffDays <= 0
                              ? '🚨 Due Today'
                              : item.diffDays === 1
                              ? '⚠️ Due Tomorrow'
                              : `${item.diffDays} days left`}
                          </span>
                        </div>

                        <h4 className="session-title">{item.title}</h4>

                        <div className="session-meta">
                          <span style={{ fontWeight: 600 }}>{item.subject}</span>
                          <span>•</span>
                          {getDifficultyBadge(item.difficulty)}
                          {getTypeBadge(item.type)}
                        </div>
                      </div>

                      <div className="session-tip">
                        <strong>Strategy:</strong> {item.sessionTip}
                      </div>

                      <button
                        className="btn btn-secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => handleToggleComplete(item.id)}
                      >
                        <Check size={16} />
                        Mark as Completed
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CALENDAR */}
          {activeTab === 'calendar' && (
            <div>
              <div className="page-header">
                <div className="header-titles">
                  <h2>Academic Calendar</h2>
                  <p className="header-subtitle">
                    Visualize coursework deadlines, exam dates, and milestones by month.
                  </p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    <Plus size={16} />
                    Add Event
                  </button>
                </div>
              </div>

              <div className="calendar-container">
                <div className="calendar-header">
                  <h3>{currentMonthYear}</h3>
                  <div className="calendar-nav">
                    <button className="btn btn-secondary" onClick={prevMonth}>
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCalendarDate(new Date())}
                    >
                      Today
                    </button>
                    <button className="btn btn-secondary" onClick={nextMonth}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="calendar-weekday">
                      {d}
                    </div>
                  ))}

                  {calendarDays.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`calendar-cell ${
                        !cell.isCurrentMonth ? 'other-month' : ''
                      } ${cell.isToday ? 'today' : ''}`}
                    >
                      <div className="cell-date-row">
                        <span className="cell-number">{cell.dateNumber}</span>
                        {cell.isToday && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: '#2563eb',
                            }}
                          >
                            TODAY
                          </span>
                        )}
                      </div>

                      <div className="cell-tasks">
                        {cell.tasks.map((task) => {
                          const lower = task.type.toLowerCase();
                          let styleClass = 'assignment';
                          if (lower.includes('exam')) styleClass = 'exam';
                          else if (lower.includes('reading')) styleClass = 'reading';
                          else if (lower.includes('project')) styleClass = 'project';
                          else if (lower.includes('quiz')) styleClass = 'quiz';

                          return (
                            <div
                              key={task.id}
                              className={`calendar-task-pill ${styleClass}`}
                              title={`${task.subject}: ${task.title}`}
                              onClick={() => handleOpenEditModal(task)}
                            >
                              {task.title}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Task Creation / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Create New Course Task'}</h3>
              <button
                className="btn btn-ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Linear Algebra Problem Set"
                    value={formData.title}
                    onChange={handleFormChange}
                  />
                  {formErrors.title && (
                    <div className="form-error">{formErrors.title}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Subject / Course *</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Mathematics"
                      value={formData.subject}
                      onChange={handleFormChange}
                    />
                    {formErrors.subject && (
                      <div className="form-error">{formErrors.subject}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Due Date *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleFormChange}
                    />
                    {formErrors.deadline && (
                      <div className="form-error">{formErrors.deadline}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Task Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                    >
                      <option value="Assignment">Assignment</option>
                      <option value="Exam">Exam</option>
                      <option value="Reading">Reading</option>
                      <option value="Project">Project</option>
                      <option value="Quiz">Quiz</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleFormChange}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Estimated Hours to Complete</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleFormChange}
                  />
                  {formErrors.estimatedHours && (
                    <div className="form-error">{formErrors.estimatedHours}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'danger' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Sparkles size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

