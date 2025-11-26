import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is already logged in
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        // Validate user object has required properties
        if (currentUser && currentUser.id && currentUser.username) {
          console.log('Found existing user:', currentUser);
          setUser(currentUser);
          setTheme(currentUser?.theme || 'light');
        } else {
          console.warn('Invalid user data in localStorage, clearing...');
          localStorage.removeItem('currentUser');
        }
      }
    } catch (err) {
      console.error('Error loading user:', err);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    setTheme('light');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setTheme('light');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setTheme(updatedUser?.theme || 'light');
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
