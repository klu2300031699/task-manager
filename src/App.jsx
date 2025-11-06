import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from './apis/auth';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
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
      {user ? (
        <>
          <Header user={user} onLogout={handleLogout} />
          <Dashboard user={user} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
