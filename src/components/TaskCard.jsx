import React from 'react';
import { getAllUsers } from '../apis/auth';
import { updateTask, deleteTask } from '../apis/taskService';
import './TaskCard.css';

const TaskCard = ({ task, currentUser, onTaskChange, onEdit }) => {
  const users = getAllUsers();
  // Use == to handle string/number comparison
  const assignedUser = users.find(u => u.id == task.assignedTo);
  const createdByUser = users.find(u => u.id == task.createdBy);
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = dueDate < today && task.status !== 'completed';
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'active' : 'completed';
    updateTask(task.id, { status: newStatus });
    onTaskChange();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onTaskChange();
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-header">
        <div className="task-checkbox-container">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={handleStatusToggle}
            className="task-checkbox"
          />
        </div>
        <div className={`priority-badge ${getPriorityClass()}`}>
          {task.priority}
        </div>
      </div>

      <div className="task-card-body">
        <h4 className="task-title">{task.title}</h4>
        <p className="task-description">{task.description}</p>

        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map(tag => (
              <span key={tag} className="task-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="task-meta">
          <div className="task-meta-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{task.category}</span>
          </div>

          <div className="task-meta-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className={isOverdue ? 'overdue-text' : ''}>
              {formatDate(task.dueDate)}
              {!isOverdue && task.status !== 'completed' && daysUntilDue >= 0 && (
                <span className="days-left">
                  {daysUntilDue === 0 ? ' (Today)' : ` (${daysUntilDue}d)`}
                </span>
              )}
              {isOverdue && <span className="overdue-label"> (Overdue)</span>}
            </span>
          </div>
        </div>

        <div className="task-footer">
          <div className="task-users">
            <div 
              className="user-avatar" 
              title={`Assigned to: ${assignedUser?.name}`}
              style={{ backgroundColor: assignedUser?.avatarColor || '#6366f1' }}
            >
              {assignedUser?.name.charAt(0).toUpperCase()}
            </div>
            {createdByUser && createdByUser.id != assignedUser?.id && (
              <div 
                className="user-avatar secondary" 
                title={`Created by: ${createdByUser.name}`}
                style={{ backgroundColor: createdByUser?.avatarColor || '#3b82f6' }}
              >
                {createdByUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="task-actions">
            <button 
              className="action-btn edit-btn" 
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="action-btn delete-btn" 
              onClick={handleDelete}
              title="Delete task"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {task.notes && (
        <div className="task-notes">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
          </svg>
          <span>{task.notes}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
