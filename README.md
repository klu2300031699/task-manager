# TaskMaster Pro - Task Management System

A modern, feature-rich task management application built with React and Vite. Currently using localStorage for data persistence with easy migration path to backend integration.

## 🚀 Features

### ✅ User Authentication
- **User Registration**: New users can sign up with username, email, and password
- **User Login**: Secure login with username and password
- **Pre-configured Demo Accounts**: Quick login for testing
  - Username: `Gnanesh` / Password: `Gnanesh`
  - Username: `Ashika` / Password: `Ashika`
  - Username: `Ashesh` / Password: `Ashesh`
- **Session Management**: Persistent login across page refreshes

### 👤 Profile Management (NEW!)
- **Comprehensive Profile Editor**: Click on your profile avatar to access
- **4 Powerful Tabs**:
  - 📝 **Profile Tab**: Edit name, username, email, and password
  - 🎨 **Avatar Tab**: Choose from 10 beautiful color schemes for your avatar
  - 🌙 **Theme Tab**: Light mode, Dark mode, or Auto (follows system)
  - 📊 **Statistics Tab**: View your task completion stats and account info
- **Real-time Updates**: All changes apply instantly across the app
- **Secure Password Change**: Verify current password before updating
- **Validation**: Email format validation and duplicate prevention

### 📋 Task Management
- **Create Tasks**: Add new tasks with detailed information
- **Edit Tasks**: Modify existing tasks
- **Delete Tasks**: Remove unwanted tasks
- **Assign Tasks to Users**: Assign tasks to any registered user (tasks appear in assigned user's dashboard)
- **Task Status**: Toggle between Active and Completed
- **Priority Levels**: Low, Medium, High
- **Categories**: Personal, Work, Academic, Development
- **Due Dates**: Set deadlines with overdue tracking
- **Tags**: Add multiple tags for better organization
- **Notes**: Additional notes for each task

### 📊 Dashboard
- **Welcome Message**: Personalized greeting for logged-in user
- **Statistics Cards**: Total, Active, Completed, Overdue tasks
- **Task Filters**: All, Active, Completed, Overdue, Assigned to me, Created by me
- **Search**: Search tasks by title, description, or tags
- **Sort Options**: Sort by due date, priority, or created date

### 🎨 Design Features
- Modern gradient color scheme (purple to violet)
- **Dark mode support** with smooth transitions
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Beautiful task cards with hover effects
- Customizable avatar colors
- Interactive UI elements with micro-animations
- Toast notifications for user feedback

### ⚡ Quick Actions (NEW!)
Floating action button with powerful utilities:
- **📤 Export Tasks**: Download all your tasks as JSON
- **📥 Import Tasks**: Import tasks from JSON file
- **🗑️ Clear Completed**: Bulk delete all completed tasks
- Smooth animations and easy access

### 🔔 Smart Notifications
- Real-time toast notifications
- Success, error, warning, and info messages
- Auto-dismiss after 4 seconds
- Manual dismiss option
- Beautiful color-coded alerts

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔄 Backend Migration Guide

### Current Architecture (localStorage)
All data is stored in browser localStorage:
- Users: `localStorage.users`
- Tasks: `localStorage.tasks`
- Current User: `localStorage.currentUser`

### Migration Steps

#### 1. Replace `src/apis/auth.js` API calls
```javascript
// Current: localStorage
export const register = (userData) => { /* ... */ }

// Backend: API calls
export const register = async (userData) => {
  const response = await fetch('YOUR_API/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};
```

#### 2. Replace `src/apis/taskService.js` API calls
```javascript
// Add authentication headers
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Update all functions to use fetch/axios
export const createTask = async (taskData) => {
  const response = await fetch('YOUR_API/tasks', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(taskData)
  });
  return await response.json();
};
```

### Required Backend Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/users` - Get all users (for assignment dropdown)
- `GET /api/tasks/user/:userId` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Database Schema

**Users Table:**
```sql
- id (INT, PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)
```

**Tasks Table:**
```sql
- id (INT, PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- status (ENUM: 'active', 'completed')
- priority (ENUM: 'low', 'medium', 'high')
- category (VARCHAR)
- due_date (DATE)
- created_by (INT, FOREIGN KEY -> users.id)
- assigned_to (INT, FOREIGN KEY -> users.id)
- tags (JSON/TEXT)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🎯 Task Assignment Flow

When User A assigns a task to User B:
1. Task saved with `assignedTo: UserB.id`
2. User B logs in
3. Dashboard shows tasks where `assignedTo === UserB.id` or `createdBy === UserB.id`
4. Real-time updates via event listeners

## 🔧 Build

```bash
npm run build
```

---

**Built with React + Vite**
