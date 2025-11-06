import React, { useState } from 'react';
import { login, register } from '../apis/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateSignup = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignup) {
      // Handle signup
      if (!validateSignup()) {
        setIsLoading(false);
        return;
      }

      const result = register({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      setTimeout(() => {
        if (result.success) {
          onLogin(result.user);
        } else {
          setError(result.message);
        }
        setIsLoading(false);
      }, 500);
    } else {
      // Handle login
      if (!formData.username.trim() || !formData.password.trim()) {
        setError('Please enter both username and password');
        setIsLoading(false);
        return;
      }

      const result = login(formData.username, formData.password);
      
      setTimeout(() => {
        if (result.success) {
          onLogin(result.user);
        } else {
          setError(result.message);
        }
        setIsLoading(false);
      }, 500);
    }
  };

  const handleQuickLogin = (user) => {
    setFormData(prev => ({
      ...prev,
      username: user,
      password: user
    }));
    setIsSignup(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shape shape1"></div>
        <div className="bg-shape shape2"></div>
        <div className="bg-shape shape3"></div>
      </div>
      
      <div className="login-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to TaskMaster Pro</h1>
          <p className="welcome-subtitle">
            Your ultimate productivity companion for managing tasks efficiently
          </p>
          <div className="features">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Create & Assign Tasks</div>
            </div>
            <div className="feature">
              <div className="feature-icon">👥</div>
              <div className="feature-text">Collaborate with Team</div>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <div className="feature-text">Track Progress</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">Meet Deadlines</div>
            </div>
          </div>
        </div>

        <div className="login-box">
          <div className="login-header">
            <h2>{isSignup ? 'Create Account' : 'Sign In'}</h2>
            <p>{isSignup ? 'Register to start managing tasks' : 'Enter your credentials to continue'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={error ? 'error' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={error ? 'error' : ''}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={error ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={error ? 'error' : ''}
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={error ? 'error' : ''}
                />
              </div>
            )}

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" className="toggle-btn" onClick={toggleMode}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
