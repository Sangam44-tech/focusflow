# FocusFlow - Project Management & Productivity App

A modern project management application with AI-powered planning capabilities.

## Features

- 🚀 **Project Management**: Create and organize projects with tasks
- 🤖 **AI Planner**: Generate project plans using AI
- 📊 **Analytics**: Track productivity and progress
- 🎯 **Task Management**: Kanban-style task boards
- 🔐 **Authentication**: Secure user authentication
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form with Zod validation
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- Prisma ORM with PostgreSQL
- JWT authentication
- Zod validation
- Rate limiting and security middleware
- Google Gemini AI integration

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Database named 'focusflow_db'

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusflow
   ```

2. **Setup Database**
   - Make sure PostgreSQL is running
   - Create database: `CREATE DATABASE focusflow_db;`
   - Or run: `psql -U postgres -c "CREATE DATABASE focusflow_db;"`

3. **Run setup script (Windows)**
   ```bash
   setup.bat
   ```

4. **Or manual setup:**

   **Backend Setup:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   ```

   **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/focusflow_db"
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-key (optional)
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
focusflow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/projects/:id/tasks` - Get project tasks
- `POST /api/projects/:id/tasks` - Create task
- `PATCH /api/tasks/:id/status` - Update task status

### AI Planner
- `POST /api/ai/generate` - Generate AI plan
- `POST /api/ai/import` - Import plan as project

## Features Overview

### Dashboard
- Project overview and statistics
- Recent projects and tasks
- Quick actions and productivity insights

### Project Management
- Create and organize projects
- Color-coded project cards
- Project statistics and progress tracking

### Task Management
- Kanban-style task boards
- Drag-and-drop functionality (planned)
- Priority levels and status tracking

### AI Planner
- Natural language goal input
- AI-generated task breakdowns
- One-click project import

### Analytics
- Productivity metrics
- Progress tracking
- Weekly reports and insights

## Development

### Database Schema
The app uses Prisma with PostgreSQL. Key models:
- User (authentication and profile)
- Project (project management)
- Task (task tracking)
- AIPlan (AI-generated plans)

### Authentication
- JWT-based authentication
- Access and refresh tokens
- Protected routes and middleware

### Styling
- Tailwind CSS for utility-first styling
- Custom color palette with primary brand colors
- Responsive design patterns

## Deployment

FocusFlow can be deployed using several methods:

### Quick Deploy
```bash
# Windows
deploy.bat

# Unix/Linux/macOS
./deploy.sh
```

### Recommended: Render + Vercel
- **Backend**: Deploy to Render using `render.yaml`
- **Frontend**: Deploy to Vercel using `vercel.json`
- **Database**: Use Neon or Supabase PostgreSQL

### Other Options
- Docker deployment with `Dockerfile`
- Manual deployment to any Node.js hosting
- Self-hosted with PM2 or similar

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.