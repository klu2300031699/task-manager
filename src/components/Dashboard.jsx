import React, { useState, useEffect } from 'react';
import { getTaskStats } from '../apis/taskService';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import './Dashboard.css';

const Dashboard = ({ user, onTasksChange }) => {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, overdue: 0 });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = () => {
    const taskStats = getTaskStats(user.id);
    setStats(taskStats);
  };

  useEffect(() => {
    loadStats();
  }, [user.id]);

  const handleTaskChange = () => {
    loadStats();
    setRefreshKey(prev => prev + 1); // Force re-render of TaskList
    if (onTasksChange) onTasksChange();
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-message">
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Here's what's happening with your tasks today</p>
          </div>
          <button className="new-task-btn" onClick={handleNewTask}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Task
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card active">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card overdue">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.overdue}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>

        <TaskList 
          key={refreshKey}
          user={user} 
          onTaskChange={handleTaskChange}
          onEditTask={handleEditTask}
        />
      </div>

      {showTaskForm && (
        <TaskForm 
          user={user}
          task={editingTask}
          onClose={handleCloseForm}
          onTaskChange={handleTaskChange}
        />
      )}
    </div>
  );
};

export default Dashboard;
