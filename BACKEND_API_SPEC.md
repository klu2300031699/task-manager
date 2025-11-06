# Backend API Specification

This document outlines the required API endpoints for backend integration.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication

### Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string (required, unique, min 3 chars)",
  "password": "string (required, min 4 chars)",
  "name": "string (required)",
  "email": "string (required, unique, valid email)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "number",
    "username": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string (JWT token)"
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "Username already exists" // or other error message
}
```

### Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "number",
    "username": "string",
    "name": "string"
  },
  "token": "string (JWT token)"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Get All Users
**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "id": "number",
    "username": "string",
    "name": "string"
  }
]
```

## Tasks

### Get User Tasks
**Endpoint:** `GET /tasks/user/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "active" | "completed",
    "priority": "low" | "medium" | "high",
    "category": "string",
    "dueDate": "string (ISO date)",
    "createdBy": "number (user ID)",
    "assignedTo": "number (user ID)",
    "tags": ["string"],
    "notes": "string",
    "createdAt": "string (ISO timestamp)",
    "updatedAt": "string (ISO timestamp)"
  }
]
```

### Create Task
**Endpoint:** `POST /tasks`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "status": "active" | "completed",
  "priority": "low" | "medium" | "high",
  "category": "string",
  "dueDate": "string (ISO date, required)",
  "assignedTo": "number (user ID, required)",
  "tags": ["string"],
  "notes": "string"
}
```

**Success Response (201):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "active",
  "priority": "medium",
  "category": "string",
  "dueDate": "string",
  "createdBy": "number",
  "assignedTo": "number",
  "tags": ["string"],
  "notes": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Update Task
**Endpoint:** `PUT /tasks/:taskId`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:** (all fields optional, only send what changed)
```json
{
  "title": "string",
  "description": "string",
  "status": "active" | "completed",
  "priority": "low" | "medium" | "high",
  "category": "string",
  "dueDate": "string",
  "assignedTo": "number",
  "tags": ["string"],
  "notes": "string"
}
```

**Success Response (200):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "category": "string",
  "dueDate": "string",
  "createdBy": "number",
  "assignedTo": "number",
  "tags": ["string"],
  "notes": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Delete Task
**Endpoint:** `DELETE /tasks/:taskId`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Get Task Statistics
**Endpoint:** `GET /tasks/stats/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "total": "number",
  "active": "number",
  "completed": "number",
  "overdue": "number"
}
```

## Error Responses

All endpoints should handle errors consistently:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Security Requirements

1. **Password Hashing:** Use bcrypt or argon2 for password hashing
2. **JWT Tokens:** Use secure secret key, set appropriate expiration
3. **CORS:** Configure CORS to allow only your frontend domain
4. **Rate Limiting:** Implement rate limiting on auth endpoints
5. **Input Validation:** Validate and sanitize all inputs
6. **SQL Injection Protection:** Use parameterized queries/ORM
7. **XSS Protection:** Sanitize user-generated content

## Database Indexes

For optimal performance, create indexes on:
- `users.username`
- `users.email`
- `tasks.created_by`
- `tasks.assigned_to`
- `tasks.status`
- `tasks.due_date`

## WebSocket Support (Optional Enhancement)

For real-time updates, consider implementing WebSocket connections:

**Endpoint:** `ws://your-api-domain.com/ws`

**Events:**
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `task:assigned` - Task assigned to user

This allows instant updates across all user sessions without polling.

## Example Node.js/Express Backend Structure

```
backend/
├── server.js
├── config/
│   ├── database.js
│   └── auth.js
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── middleware/
│   ├── authMiddleware.js
│   └── validation.js
└── controllers/
    ├── authController.js
    └── taskController.js
```

## Testing the Backend

Use tools like Postman or Insomnia to test API endpoints before frontend integration.

### Sample cURL Commands

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","name":"Test User","email":"test@example.com"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Task","description":"Test","status":"active","priority":"medium","category":"personal","dueDate":"2025-11-10","assignedTo":1,"tags":[],"notes":""}'
```

---

**Ready for Backend Integration! 🚀**
