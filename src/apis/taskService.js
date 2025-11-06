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
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: completed,
    pending: tasks.filter(t => t.status === 'active').length,
    completionRate: completionRate,
    overdue: tasks.filter(t => {
      if (t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date();
    }).length
  };
};

// Export tasks to JSON file
export const exportTasks = (userId) => {
  const tasks = getUserTasks(userId);
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import tasks from JSON file
export const importTasks = (file, userId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          reject(new Error('Invalid file format'));
          return;
        }
        
        const tasks = getAllTasks();
        const newTasks = importedTasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        const updatedTasks = [...tasks, ...newTasks];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
        notifyTasksUpdated();
        resolve(newTasks.length);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Clear all completed tasks for a user
export const clearCompletedTasks = (userId) => {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => {
    // Keep tasks that are not completed OR not owned by this user
    return task.status !== 'completed' || (task.createdBy != userId && task.assignedTo != userId);
  });
  const deletedCount = tasks.length - filteredTasks.length;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  notifyTasksUpdated();
  return deletedCount;
};
