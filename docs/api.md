# FocusFlow API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://focusflow-api.onrender.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

## Projects

### Get All Projects
```http
GET /projects
Authorization: Bearer <token>
```

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "priority": "HIGH",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "status": "COMPLETED"
}
```

## Tasks

### Get Project Tasks
```http
GET /projects/:projectId/tasks
Authorization: Bearer <token>
```

### Create Task
```http
POST /projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "priority": "MEDIUM",
  "dueDate": "2024-12-25T10:00:00.000Z"
}
```

### Update Task Status
```http
PATCH /tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

## AI Planner

### Generate AI Plan
```http
POST /ai/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "goal": "Build a portfolio website",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "plan_id",
    "projectName": "Portfolio Website Development",
    "projectDescription": "Create a professional portfolio website",
    "deadline": "2024-12-31T23:59:59.000Z",
    "tasks": [
      {
        "title": "Design Website Layout",
        "description": "Create wireframes and mockups",
        "priority": "HIGH",
        "dueDate": "2024-12-10T23:59:59.000Z"
      }
    ]
  }
}
```

### Import Plan as Project
```http
POST /ai/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "plan_id",
  "projectName": "Custom Project Name"
}
```

## Analytics

### Get Analytics Overview
```http
GET /analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "totalTasks": 25,
    "completedTasks": 15,
    "completionRate": 60,
    "currentStreak": 7,
    "bestStreak": 14
  }
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per 15 minutes
- **AI endpoints**: 3 requests per day (free tier)