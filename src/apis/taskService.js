// Task management service
const STORAGE_KEY = 'tasks';

// Initialize with sample tasks
const initializeTasks = () => {
  const existingTasks = localStorage.getItem(STORAGE_KEY);
  if (!existingTasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

initializeTasks();

// Get all tasks
export const getAllTasks = () => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

// Get tasks for a specific user (created by or assigned to)
export const getUserTasks = (userId) => {
  const tasks = getAllTasks();
  // Use == instead of === to handle string/number comparison
  return tasks.filter(task => 
    task.createdBy == userId || task.assignedTo == userId
  );
};

// Get task by ID
export const getTaskById = (taskId) => {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === taskId);
};

// Dispatch custom event to notify all components about task changes
const notifyTasksUpdated = () => {
  window.dispatchEvent(new Event('tasksUpdated'));
};

// Create new task
export const createTask = (taskData) => {
  const tasks = getAllTasks();
  const newTask = {
    id: Date.now().toString(),
    ...taskData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  notifyTasksUpdated();
  return newTask;
};

// Update task
export const updateTask = (taskId, updates) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    notifyTasksUpdated();
    return tasks[taskIndex];
  }
  return null;
};

// Delete task
export const deleteTask = (taskId) => {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  notifyTasksUpdated();
  return true;
};

// Get task statistics
export const getTaskStats = (userId) => {
  const tasks = getUserTasks(userId);
  return {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => {
      if (t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date();
    }).length
  };
};
