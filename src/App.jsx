import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from './apis/auth';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setTheme(currentUser.theme || 'light');
    }
    setLoading(false);

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      setUser(event.detail);
      setTheme(event.detail.theme || 'light');
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    setTheme(userData.theme || 'light');
  };

  const handleLogout = () => {
    setUser(null);
    setTheme('light');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setTheme(updatedUser.theme || 'light');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <Notification />
      {user ? (
        <>
          <Header 
            user={user} 
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
          <Dashboard user={user} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
