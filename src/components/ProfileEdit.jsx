import React, { useState, useEffect } from 'react';
import { getUserDetails, updateUser } from '../apis/auth';
import { getTaskStats } from '../apis/taskService';
import { showNotification } from './Notification';
import './ProfileEdit.css';

const ProfileEdit = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || '#6366f1');
  const [theme, setTheme] = useState(user.theme || 'light');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const avatarColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  useEffect(() => {
    // Load full user details
    const userDetails = getUserDetails(user.id);
    if (userDetails) {
      setFormData(prev => ({
        ...prev,
        email: userDetails.email
      }));
      setAvatarColor(userDetails.avatarColor || '#6366f1');
      setTheme(userDetails.theme || 'light');
    }

    // Load task statistics
    const taskStats = getTaskStats(user.id);
    setStats(taskStats);
  }, [user.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate inputs
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    const updateData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatarColor,
      theme
    };

    // Handle password change if requested
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Please enter your current password');
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.newPassword.length < 3) {
        setError('Password must be at least 3 characters');
        setLoading(false);
        return;
      }

      // Verify current password
      const userDetails = getUserDetails(user.id);
      if (userDetails.password !== formData.currentPassword) {
        setError('Current password is incorrect');
        setLoading(false);
        return;
      }

      updateData.password = formData.newPassword;
    }

    const result = updateUser(user.id, updateData);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      showNotification('Profile updated successfully!', 'success');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(result.user);
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message);
      showNotification(result.message, 'error');
    }
  };

  const handleAvatarColorChange = (color) => {
    setAvatarColor(color);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const renderProfileTab = () => (
    <div className="profile-tab">
      <form onSubmit={handleProfileUpdate}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderAvatarTab = () => (
    <div className="avatar-tab">
      <h3>Customize Your Avatar</h3>
      <div className="avatar-preview">
        <div 
          className="avatar-large" 
          style={{ backgroundColor: avatarColor }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <h4>Choose Avatar Color</h4>
      <div className="color-grid">
        {avatarColors.map((color) => (
          <div
            key={color.value}
            className={`color-option ${avatarColor === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleAvatarColorChange(color.value)}
            title={color.name}
          >
            {avatarColor === color.value && (
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={handleProfileUpdate}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Avatar'}
        </button>
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="theme-tab">
      <h3>Theme Preferences</h3>
      <div className="theme-options">
        <div 
          className={`theme-card ${theme === 'light' ? 'selected' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
          <div className="theme-preview light-preview">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-box"></div>
              <div className="preview-box"></div>
            </div>
          </div>
          <h4>Light Mode</h4>
          <p>Classic bright interface</p>
        </div>

        <div 
          className={`theme-card ${theme === 'dark' ? 'selected' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <div className="theme-preview dark-preview">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-box"></div>
              <div className="preview-box"></div>
            </div>
          </div>
          <h4>Dark Mode</h4>
          <p>Easy on the eyes</p>
        </div>

        <div 
          className={`theme-card ${theme === 'auto' ? 'selected' : ''}`}
          onClick={() => handleThemeChange('auto')}
        >
          <div className="theme-preview auto-preview">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-box"></div>
              <div className="preview-box"></div>
            </div>
          </div>
          <h4>Auto</h4>
          <p>Follows system settings</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={handleProfileUpdate}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Theme'}
        </button>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="stats-tab">
      <h3>Your Statistics</h3>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rate">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>
        </div>
      )}

      <div className="account-info">
        <h4>Account Information</h4>
        <div className="info-item">
          <span className="info-label">Account ID:</span>
          <span className="info-value">{user.id}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Username:</span>
          <span className="info-value">@{user.username}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Member Since:</span>
          <span className="info-value">
            {new Date(getUserDetails(user.id)?.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
            onClick={() => setActiveTab('avatar')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Avatar
          </button>
          <button
            className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Theme
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Statistics
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'avatar' && renderAvatarTab()}
          {activeTab === 'theme' && renderThemeTab()}
          {activeTab === 'stats' && renderStatsTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
