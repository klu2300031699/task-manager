import React, { useState, useEffect } from 'react';
import { getUserTasks } from '../apis/taskService';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = ({ user, onTaskChange, onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const loadTasks = () => {
    const userTasks = getUserTasks(user.id);
    setTasks(userTasks);
  };

  useEffect(() => {
    loadTasks();

    // Listen for storage events (when tasks are updated)
    const handleStorageChange = (e) => {
      if (e.key === 'tasks') {
        loadTasks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleTasksUpdate = () => {
      loadTasks();
    };
    
    window.addEventListener('tasksUpdated', handleTasksUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasksUpdated', handleTasksUpdate);
    };
  }, [user.id]);

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(task => task.status === 'active');
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    } else if (filter === 'overdue') {
      filtered = filtered.filter(task => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date();
      });
    } else if (filter === 'assigned') {
      // Use == to handle string/number comparison
      filtered = filtered.filter(task => task.assignedTo == user.id && task.createdBy != user.id);
    } else if (filter === 'created') {
      // Use == to handle string/number comparison
      filtered = filtered.filter(task => task.createdBy == user.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3>Tasks</h3>
        <div className="task-controls">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Created Date</option>
          </select>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Tasks
          <span className="count">{tasks.length}</span>
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
          <span className="count">{tasks.filter(t => t.status === 'active').length}</span>
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
          <span className="count">{tasks.filter(t => t.status === 'completed').length}</span>
        </button>
        <button 
          className={filter === 'overdue' ? 'active' : ''} 
          onClick={() => setFilter('overdue')}
        >
          Overdue
          <span className="count">
            {tasks.filter(t => {
              if (t.status === 'completed') return false;
              const dueDate = new Date(t.dueDate);
              return dueDate < new Date();
            }).length}
          </span>
        </button>
        <button 
          className={filter === 'assigned' ? 'active' : ''} 
          onClick={() => setFilter('assigned')}
        >
          Assigned to Me
          <span className="count">
            {tasks.filter(t => t.assignedTo === user.id && t.createdBy !== user.id).length}
          </span>
        </button>
        <button 
          className={filter === 'created' ? 'active' : ''} 
          onClick={() => setFilter('created')}
        >
          Created by Me
          <span className="count">{tasks.filter(t => t.createdBy === user.id).length}</span>
        </button>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4>No tasks found</h4>
            <p>
              {searchQuery 
                ? "Try adjusting your search" 
                : "Create a new task to get started!"}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={user}
              onTaskChange={onTaskChange}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
