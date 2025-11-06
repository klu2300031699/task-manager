// Authentication service for user login/signup
const USERS_STORAGE_KEY = 'users';

// Initialize default users
const DEFAULT_USERS = [
  { id: 1, username: 'Gnanesh', password: 'Gnanesh', name: 'Gnanesh', email: 'gnanesh@example.com', createdAt: new Date().toISOString() },
  { id: 2, username: 'Ashika', password: 'Ashika', name: 'Ashika', email: 'ashika@example.com', createdAt: new Date().toISOString() },
  { id: 3, username: 'Ashesh', password: 'Ashesh', name: 'Ashesh', email: 'ashesh@example.com', createdAt: new Date().toISOString() }
];

// Initialize users in localStorage if not present
const initializeUsers = () => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

initializeUsers();

// Get all users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : DEFAULT_USERS;
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Get all users for assignment dropdown
export const getAllUsers = () => {
  const users = getUsers();
  return users.map(user => ({ 
    id: user.id, 
    name: user.name, 
    username: user.username,
    avatarColor: user.avatarColor || '#6366f1'
  }));
};

// Register new user
export const register = (userData) => {
  const users = getUsers();
  
  // Check if username already exists
  const existingUser = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
  if (existingUser) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Check if email already exists
  const existingEmail = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingEmail) {
    return { success: false, message: 'Email already exists' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now(), // Use timestamp as unique ID
    username: userData.username,
    password: userData.password,
    name: userData.name,
    email: userData.email,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const userResponse = { id: newUser.id, username: newUser.username, name: newUser.name };
  localStorage.setItem('currentUser', JSON.stringify(userResponse));
  
  return { success: true, user: userResponse };
};

// Login function
export const login = (username, password) => {
  const users = getUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    const userData = { id: user.id, username: user.username, name: user.name };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, user: userData };
  }
  
  return { success: false, message: 'Invalid username or password' };
};

// Logout function
export const logout = () => {
  localStorage.removeItem('currentUser');
};

// Get current logged in user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Get full user details (including password for edit)
export const getUserDetails = (userId) => {
  const users = getUsers();
  return users.find(u => u.id === userId);
};

// Update user profile
export const updateUser = (userId, updateData) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Check if username is being changed and already exists
  if (updateData.username && updateData.username !== users[userIndex].username) {
    const existingUser = users.find(u => u.username.toLowerCase() === updateData.username.toLowerCase() && u.id !== userId);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }
  }
  
  // Check if email is being changed and already exists
  if (updateData.email && updateData.email !== users[userIndex].email) {
    const existingEmail = users.find(u => u.email.toLowerCase() === updateData.email.toLowerCase() && u.id !== userId);
    if (existingEmail) {
      return { success: false, message: 'Email already exists' };
    }
  }
  
  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  saveUsers(users);
  
  // Update current user in localStorage
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedUserData = { 
      id: users[userIndex].id, 
      username: users[userIndex].username, 
      name: users[userIndex].name,
      avatarColor: users[userIndex].avatarColor,
      theme: users[userIndex].theme
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
    
    // Dispatch custom event for profile update
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUserData }));
    
    return { success: true, user: updatedUserData };
  }
  
  return { success: true, user: users[userIndex] };
};
