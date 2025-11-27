// Task management service
const STORAGE_KEY = 'tasks';
const BASE_URL = 'http://localhost:3221/api/tasks';

// Initialize with sample tasks
const initializeTasks = () => {
  const existingTasks = localStorage.getItem(STORAGE_KEY);
  if (!existingTasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

initializeTasks();

// Get all tasks from backend
export const getAllTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (response.ok) {
      const tasks = await response.json();
      // Also sync with localStorage as fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return tasks;
    }
  } catch (error) {
    console.error('Error fetching tasks from backend:', error);
  }
  // Fallback to localStorage
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

// Get tasks for a specific user (created by or assigned to)
export const getUserTasks = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (response.ok) {
      const tasks = await response.json();
      return tasks;
    }
  } catch (error) {
    console.error('Error fetching user tasks:', error);
  }
  // Fallback to localStorage
  const tasks = await getAllTasks();
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
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      const newTask = await response.json();
      notifyTasksUpdated();
      return newTask;
    } else {
      console.error('Failed to create task on backend');
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
  
  // Fallback to localStorage
  const tasks = await getAllTasks();
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
export const updateTask = async (taskId, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/update/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      notifyTasksUpdated();
      return updatedTask;
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }

  // Fallback to localStorage
  const tasks = await getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id == taskId);
  
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
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      notifyTasksUpdated();
      return true;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }

  // Fallback to localStorage
  const tasks = await getAllTasks();
  const filteredTasks = tasks.filter(task => task.id != taskId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  notifyTasksUpdated();
  return true;
};

// Get task statistics
export const getTaskStats = async (userId) => {
  const tasks = await getUserTasks(userId);
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
