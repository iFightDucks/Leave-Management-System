# 🚀 Railway Deployment Guide

## Complete Leave Management System Deployment

This guide will help you deploy both the **FastAPI backend** and **Next.js frontend** to Railway.

## 📋 Prerequisites

1. **GitHub Account** (code uploaded)
2. **Railway Account** (free tier available)
3. **Railway CLI** (optional, for local management)

## 🎯 Deployment Strategy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  Railway Auto   │───▶│   Live Apps     │
│                 │    │   Deployment    │    │                 │
│ ├── backend/    │    │                 │    │ Backend API     │
│ ├── frontend/   │    │ ├── Backend     │    │ Frontend Web    │
│ └── configs     │    │ ├── Frontend    │    │ PostgreSQL DB   │
└─────────────────┘    │ └── Database    │    └─────────────────┘
                       └─────────────────┘
```

## 🔧 Step-by-Step Deployment

### **Phase 1: Setup Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your account (Railway offers $5 free credits)

### **Phase 2: Deploy Backend Service**

1. **Create New Project**
   - Click "Deploy from GitHub repo"
   - Select your `leave-management-system` repository
   - Railway will auto-detect the Python app

2. **Configure Backend Service**
   ```bash
   Service Name: leave-management-backend
   Root Directory: / (entire repo)
   Build Command: Auto-detected
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Add PostgreSQL Database**
   - In your project dashboard, click "Add Service"
   - Select "Database" → "PostgreSQL"
   - Railway automatically creates `DATABASE_URL` variable

4. **Set Environment Variables**
   ```env
   ENVIRONMENT=production
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```

### **Phase 3: Deploy Frontend Service**

1. **Add Frontend Service**
   - In the same project, click "Add Service"
   - Select "GitHub Repo" → same repository
   - Set **Root Directory**: `frontend`

2. **Configure Frontend Service**
   ```bash
   Service Name: leave-management-frontend
   Root Directory: frontend
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Set Frontend Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
   NODE_ENV=production
   ```

### **Phase 4: Connect Services**

1. **Get Backend URL**
   - Go to backend service → Settings → Domains
   - Copy the Railway-provided URL (e.g., `https://backend-xyz.railway.app`)

2. **Update Frontend Environment**
   - Go to frontend service → Variables
   - Set `NEXT_PUBLIC_API_URL` to your backend URL + `/api/v1`

3. **Update Backend CORS**
   - Go to backend service → Variables  
   - Set `FRONTEND_URL` to your frontend Railway URL

## 🌐 Service URLs Structure

After deployment, you'll have:

```
🔗 Backend API: https://leave-management-backend-xyz.railway.app
   ├── /api/v1/health (Health check)
   ├── /api/v1/employees (Employee endpoints)
   ├── /api/v1/leave-requests (Leave endpoints)
   └── /docs (FastAPI documentation)

🔗 Frontend Web: https://leave-management-frontend-xyz.railway.app
   ├── /dashboard (Main dashboard)
   ├── /employees (Employee management)
   ├── /leaves (Leave management)
   └── /employees/new (Add employee)

🔗 Database: PostgreSQL (Internal Railway URL)
   └── Automatically connected to backend
```

## 🔧 Environment Variables Setup

### **Backend Variables**
```env
DATABASE_URL=postgresql://... (Auto-provided by Railway)
ENVIRONMENT=production
FRONTEND_URL=https://your-frontend.railway.app
PORT=8000 (Auto-provided by Railway)
```

### **Frontend Variables**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
NODE_ENV=production
```

## 🚀 Auto-Deployment Setup

Railway automatically redeploys when you push to GitHub:

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Update: feature description"
   git push origin main
   ```

2. **Railway auto-deploys** both services
3. **Check deployment status** in Railway dashboard

## 🧪 Testing Deployment

### **1. Backend Health Check**
```bash
curl https://your-backend.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:00:00.000Z",
  "version": "1.0.0", 
  "environment": "production"
}
```

### **2. Frontend Access**
- Visit: `https://your-frontend.railway.app`
- Should load the dashboard
- Test employee creation and leave application

### **3. Database Connection**
- Backend logs should show successful DB connection
- Tables should be auto-created on first startup

## 📊 Monitoring & Logs

**Railway Dashboard provides:**
- 📈 **Metrics**: CPU, Memory, Network usage
- 📋 **Logs**: Real-time application logs
- 🔧 **Settings**: Environment variables, domains
- 💰 **Usage**: Resource consumption tracking

## 🛠️ Troubleshooting

### **Common Issues & Solutions**

1. **Backend won't start**
   ```
   Check: DATABASE_URL is set correctly
   Check: All dependencies installed (psycopg2-binary)
   Check: PORT environment variable
   ```

2. **Frontend can't connect to backend**
   ```
   Check: NEXT_PUBLIC_API_URL is correct
   Check: Backend CORS allows frontend domain
   Check: Both services are deployed
   ```

3. **Database connection failed**
   ```
   Check: PostgreSQL service is running
   Check: DATABASE_URL format is correct
   Check: Network connectivity between services
   ```

### **Debug Commands**
```bash
# Check backend logs
railway logs --service leave-management-backend

# Check frontend logs  
railway logs --service leave-management-frontend

# Check environment variables
railway variables --service leave-management-backend
```

## 💰 Cost Optimization

**Railway Free Tier:**
- ✅ $5 free credit monthly
- ✅ Suitable for MVP and testing
- ✅ Auto-sleep after inactivity

**For Production:**
- 💡 Monitor resource usage
- 💡 Set up custom domains
- 💡 Enable metrics and monitoring

## 🎯 Next Steps After Deployment

1. **Custom Domains** (optional)
   - Add your custom domain in Railway dashboard
   - Update environment variables accordingly

2. **SSL Certificates**
   - Railway provides free SSL certificates
   - HTTPS is enabled by default

3. **Database Backups**
   - Railway PostgreSQL includes automatic backups
   - Consider additional backup strategies for production

4. **Monitoring Setup**
   - Set up alerts for downtime
   - Monitor application performance
   - Track user activity

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)

---

## 📝 Deployment Checklist

- [ ] GitHub repository uploaded
- [ ] Railway account created
- [ ] Backend service deployed
- [ ] PostgreSQL database added
- [ ] Frontend service deployed
- [ ] Environment variables configured
- [ ] Services connected (URLs updated)
- [ ] Health checks passing
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] Auto-deployment configured

**🎉 Your Leave Management System is now live on Railway!**
