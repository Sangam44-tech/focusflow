# FocusFlow Deployment Guide

## 🚀 Quick Deploy

### Option 1: Render + Vercel (Recommended)

**Backend (Render)**
1. Fork/clone the repository
2. Connect to Render
3. Use `render.yaml` configuration
4. Set environment variables
5. Deploy

**Frontend (Vercel)**
1. Connect GitHub repo to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy automatically

### Option 2: Docker Deployment

```bash
# Clone repository
git clone https://github.com/Sangam44-tech/focusflow.git
cd focusflow

# Run with Docker Compose
docker-compose up -d
```

## 📋 Environment Setup

### Backend Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Secrets
ACCESS_TOKEN_SECRET="your-super-secret-access-token"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-token"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"

# CORS
FRONTEND_URL="https://your-frontend-domain.com"

# Optional
NODE_ENV="production"
PORT="5000"
```

### Frontend Environment Variables

```env
VITE_API_URL="https://your-backend-domain.com/api"
```

## 🗄️ Database Setup

### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set as `DATABASE_URL`

### Option 2: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Set as `DATABASE_URL`

### Option 3: Render PostgreSQL
1. Create PostgreSQL database on Render
2. Use internal connection string
3. Set as `DATABASE_URL`

## 🔧 Deployment Steps

### 1. Prepare Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy Backend (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `focusflow` repository

3. **Configure Service**
   - **Name**: `focusflow-api`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=[Your database URL]
   ACCESS_TOKEN_SECRET=[Generate random string]
   REFRESH_TOKEN_SECRET=[Generate random string]
   GEMINI_API_KEY=[Your Gemini API key]
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### 3. Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select `focusflow` repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### 4. Run Database Migrations

```bash
# After backend is deployed, run migrations
cd backend
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

## 🔍 Verification

### Test Backend
```bash
curl https://your-backend-url.onrender.com/health
```

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new account
3. Create a project
4. Generate an AI plan

## 🚨 Troubleshooting

### Common Issues

**Backend won't start**
- Check environment variables
- Verify database connection
- Check Render logs

**Frontend can't connect to backend**
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Ensure backend is running

**Database connection failed**
- Verify `DATABASE_URL` format
- Check database is accessible
- Run migrations

**AI features not working**
- Verify `GEMINI_API_KEY` is set
- Check API key permissions
- Monitor rate limits

### Logs and Debugging

**Render Logs**
```bash
# View logs in Render dashboard
# Or use Render CLI
render logs -s your-service-name
```

**Vercel Logs**
```bash
# View in Vercel dashboard
# Or use Vercel CLI
vercel logs your-deployment-url
```

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions for automatic deployment:

1. **Push to main branch**
2. **Tests run automatically**
3. **Backend deploys to Render**
4. **Frontend deploys to Vercel**

### Manual Deployment

```bash
# Trigger manual deployment
git push origin main

# Or use platform CLIs
render deploy
vercel --prod
```

## 📊 Monitoring

### Health Checks
- Backend: `https://your-backend.onrender.com/health`
- Frontend: Monitor via Vercel dashboard

### Performance
- Use Render metrics
- Monitor Vercel analytics
- Set up database monitoring

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] Database has proper access controls
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] JWT secrets are strong

## 💰 Cost Estimation

### Free Tier (Development)
- **Render**: Free web service + PostgreSQL
- **Vercel**: Free hosting
- **Neon**: Free PostgreSQL tier
- **Total**: $0/month

### Production (Recommended)
- **Render**: $7/month (Starter plan)
- **Vercel**: $20/month (Pro plan)
- **Neon**: $19/month (Scale plan)
- **Total**: ~$46/month

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform documentation
3. Open an issue on GitHub
4. Contact platform support