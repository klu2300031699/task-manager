// Authentication service for user login/signup
const BASE_URL = 'http://localhost:3221/api/user';

// Register new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        confirmPassword: userData.password
      }),
    });

    const result = await response.text();

    if (response.ok) {
      return { success: true, message: result };
    } else {
      return { success: false, message: result };
    }
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Network error. Please check if backend is running.' };
  }
};

// Login function
export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      // Map backend user to frontend format
      const userData = {
        id: user.id,
        username: user.username,
        name: user.fullName || user.username,
        email: user.email
      };
      console.log('Login successful, user data:', userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      const error = await response.text();
      return { success: false, message: error };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error. Please check if backend is running.' };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('currentUser');
};

// Get current logged in user
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing currentUser from localStorage:', error);
    localStorage.removeItem('currentUser');
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Get all users for assignment dropdown
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (response.ok) {
      const users = await response.json();
      return users.map(user => ({
        id: user.id,
        name: user.fullName,
        username: user.username,
        avatarColor: '#6366f1'
      }));
    } else {
      console.error('Failed to fetch users from backend');
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get full user details (for profile edit)
export const getUserDetails = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`);
    if (response.ok) {
      const user = await response.json();
      return {
        id: user.id,
        username: user.username,
        name: user.fullName,
        email: user.email
      };
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
  return null;
};

// Update user profile
export const updateUser = async (userId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: updateData.name || updateData.fullName,
        username: updateData.username,
        email: updateData.email
      }),
    });

    if (response.ok) {
      const user = await response.json();
      const updatedUserData = {
        id: user.id,
        username: user.username,
        name: user.fullName,
        email: user.email
      };
      
      // Update localStorage if it's the current user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        // Dispatch custom event for profile update
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUserData }));
      }
      
      return { success: true, user: updatedUserData };
    } else {
      const error = await response.text();
      return { success: false, message: error };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Network error. Please check if backend is running.' };
  }
};

// Change user password
export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/change-password/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      }),
    });

    const result = await response.text();

    if (response.ok) {
      return { success: true, message: result };
    } else {
      return { success: false, message: result };
    }
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, message: 'Network error. Please check if backend is running.' };
  }
};
