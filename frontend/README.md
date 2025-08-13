# Leave Management System - Frontend

A modern, responsive frontend for the Leave Management System built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## 🚀 Features

### 📊 Dashboard
- Real-time statistics (employees, leave requests, balances)
- Recent leave requests overview
- Quick action buttons for common tasks
- Responsive design for all devices

### 👥 Employee Management
- Employee list with search and filtering
- Add new employees with validation
- Employee detail pages with leave history
- Leave balance tracking per employee

### 📅 Leave Management
- Apply for leave with date validation
- Leave request approval/rejection interface
- Leave balance calculations
- Leave history tracking

### 🎨 Modern UI/UX
- Built with Tailwind CSS v4 (latest)
- Shadcn/ui component library
- Responsive mobile-first design
- Smooth animations and transitions
- Dark mode support (system preference)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui
- **State Management**: TanStack Query v5 + Zustand
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── employees/         # Employee management
│   ├── leaves/           # Leave management
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # React Query provider
├── components/           # React components
│   ├── ui/              # Shadcn/ui components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard components
│   ├── employees/       # Employee components
│   └── leaves/          # Leave components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── api.ts          # API client
│   ├── types.ts        # TypeScript types
│   ├── utils.ts        # Utility functions
│   └── validations.ts  # Zod schemas
└── styles/             # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- FastAPI backend running on port 8000

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📱 Pages & Features

### Dashboard (`/dashboard`)
- Employee statistics
- Recent leave requests
- Quick action buttons
- System overview

### Employees
- **List** (`/employees`) - View all employees
- **Add** (`/employees/new`) - Add new employee
- **Details** (`/employees/[id]`) - Employee details and leave history

### Leave Management
- **List** (`/leaves`) - View all leave requests
- **Apply** (`/leaves/apply`) - Submit new leave request

## 🔧 API Integration

The frontend integrates with the FastAPI backend through:

- **Employees API**: CRUD operations for employee management
- **Leave Requests API**: Apply, approve, reject leave requests
- **Leave Balance API**: Real-time leave balance calculations

### API Endpoints Used

```typescript
// Employee Management
GET    /api/v1/employees           // List employees
POST   /api/v1/employees           // Create employee
GET    /api/v1/employees/{id}      // Get employee details

// Leave Management
POST   /api/v1/leave-requests      // Apply for leave
PUT    /api/v1/leave-requests/{id}/approve  // Approve leave
PUT    /api/v1/leave-requests/{id}/reject   // Reject leave

// Leave Balance
GET    /api/v1/employees/{id}/leave-balance // Get leave balance
GET    /api/v1/employees/{id}/leave-requests // Get leave history
```

## 🎯 Key Features Implementation

### Form Validation
- Real-time validation with Zod schemas
- User-friendly error messages
- Async validation for email uniqueness
- Date range validation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Collapsible navigation

### State Management
- TanStack Query for server state
- Automatic caching and refetching
- Optimistic updates
- Error handling

### Error Handling
- Graceful error boundaries
- User-friendly error messages
- Retry mechanisms
- Loading states

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Build
```bash
npm run build
npm start
```

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced reporting dashboard
- [ ] Calendar integration
- [ ] Bulk operations
- [ ] Email notifications
- [ ] Document attachments

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] E2E testing with Playwright
- [ ] Storybook for component documentation

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation at `/docs` endpoint

## 🏗️ **High-Level Design (HLD) - Leave Management System**

### **📊 System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEPLOYMENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                    ┌─────────────────┐        │
│  │   VERCEL CDN    │                                    │   RAILWAY       │        │
│  │   (Frontend)    │                                    │   (Backend)     │        │
│  │                 │                                    │                 │        │
│  │ • Next.js 15    │◄──────── HTTPS Requests ────────►│ • FastAPI       │        │
│  │ • React 19      │                                    │ • Python 3.12   │        │
│  │ • TypeScript    │                                    │ • SQLite        │        │
│  │ • Tailwind v4   │                                    │ • SQLAlchemy    │        │
│  │                 │                                    │                 │        │
│  │ Global CDN      │                                    │ Auto-scaling    │        │
│  │ Edge Functions  │                                    │ Container       │        │
│  └─────────────────┘                                    └─────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────────────┘
                    │                                                │
                    ▼                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────┐        ┌─────────────────────────────────┐    │
│  │         FRONTEND TIER           │        │         BACKEND TIER            │    │
│  │        (Next.js App)            │        │        (FastAPI App)            │    │
│  │                                 │        │                                 │    │
│  │  ┌─────────────────────────┐    │        │  ┌─────────────────────────┐    │    │
│  │  │    Presentation Layer   │    │        │  │      API Gateway       │    │    │
│  │  │                         │    │        │  │                         │    │    │
│  │  │ • Pages (Dashboard,     │    │        │  │ • FastAPI Routes        │    │    │
│  │  │   Employees, Leaves)    │    │        │  │ • CORS Middleware       │    │    │
│  │  │ • Components (UI/UX)    │    │        │  │ • Error Handling        │    │    │
│  │  │ • Layouts & Navigation  │    │        │  │ • Request Validation    │    │    │
│  │  └─────────────────────────┘    │        │  └─────────────────────────┘    │    │
│  │              │                  │        │              │                  │    │
│  │              ▼                  │        │              ▼                  │    │
│  │  ┌─────────────────────────┐    │        │  ┌─────────────────────────┐    │    │
│  │  │    State Management     │    │        │  │    Business Logic       │    │    │
│  │  │                         │    │        │  │                         │    │    │
│  │  │ • TanStack Query v5     │◄───┼────────┼──┤ • Employee Service      │    │    │
│  │  │ • Zustand Store         │    │  HTTP  │  │ • Leave Service         │    │    │
│  │  │ • React Hook Form       │    │ RESTful│  │ • Validation Logic      │    │    │
│  │  │ • Zod Validation        │    │  APIs  │  │ • Business Rules        │    │    │
│  │  └─────────────────────────┘    │        │  └─────────────────────────┘    │    │
│  │              │                  │        │              │                  │    │
│  │              ▼                  │        │              ▼                  │    │
│  │  ┌─────────────────────────┐    │        │  ┌─────────────────────────┐    │    │
│  │  │    Client Components    │    │        │  │    Data Access Layer   │    │    │
│  │  │                         │    │        │  │                         │    │    │
│  │  │ • Dashboard Stats       │    │        │  │ • SQLAlchemy ORM        │    │    │
│  │  │ • Employee Management   │    │        │  │ • Database Models       │    │    │
│  │  │ • Leave Requests        │    │        │  │ • Query Optimization    │    │    │
│  │  │ • Forms & Validation    │    │        │  │ • Session Management    │    │    │
│  │  └─────────────────────────┘    │        │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘        └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                          DATABASE DESIGN                                   │   │
│  │                                                                             │   │
│  │  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐ │   │
│  │  │   EMPLOYEES     │         │ LEAVE_REQUESTS  │         │ LEAVE_BALANCES  │ │   │
│  │  │                 │         │                 │         │   (Computed)    │ │   │
│  │  │ • id (PK)       │◄────────┤ • id (PK)       │         │                 │ │   │
│  │  │ • name          │         │ • employee_id   │         │ • employee_id   │ │   │
│  │  │ • email (UNIQUE)│         │   (FK)          │         │ • available_days│ │   │
│  │  │ • department    │         │ • start_date    │         │ • used_days     │ │   │
│  │  │ • joining_date  │         │ • end_date      │         │ • pending_days  │ │   │
│  │  │ • annual_leave_ │         │ • days_requested│         │ • annual_       │ │   │
│  │  │   entitlement   │         │ • reason        │         │   entitlement   │ │   │
│  │  │ • created_at    │         │ • status        │         │                 │ │   │
│  │  └─────────────────┘         │   (ENUM)        │         └─────────────────┘ │   │
│  │                              │ • applied_date  │                             │   │
│  │                              │ • processed_date│                             │   │
│  │                              │ • processed_by  │                             │   │
│  │                              └─────────────────┘                             │   │
│  │                                                                             │   │
│  │  Status ENUM: ['pending', 'approved', 'rejected']                          │   │
│  │  Indexes: employee_id, email, status, applied_date                         │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### **🌐 Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION DEPLOYMENT                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                            VERCEL FRONTEND                                 │   │
│  │                                                                             │   │
│  │  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │   │
│  │  │   US-EAST-1     │   │   EU-WEST-1     │   │   ASIA-PACIFIC  │           │   │
│  │  │   Edge Node     │   │   Edge Node     │   │   Edge Node     │           │   │
│  │  │                 │   │                 │   │                 │           │   │
│  │  │ • Static Files  │   │ • Static Files  │   │ • Static Files  │           │   │
│  │  │ • Edge Functions│   │ • Edge Functions│   │ • Edge Functions│           │   │
│  │  │ • CDN Cache     │   │ • CDN Cache     │   │ • CDN Cache     │           │   │
│  │  └─────────────────┘   └─────────────────┘   └─────────────────┘           │   │
│  │                                                                             │   │
│  │  Features:                                                                  │   │
│  │  • Automatic SSL/TLS                                                       │   │
│  │  • Global CDN Distribution                                                 │   │
│  │  • Serverless Functions                                                    │   │
│  │  • Automatic Deployments from Git                                          │   │
│  │  • Preview Deployments for PRs                                             │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                     │                                              │
│                              HTTPS/REST API                                        │
│                                     │                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           RAILWAY BACKEND                                  │   │
│  │                                                                             │   │
│  │  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │   │
│  │  │   US-WEST-2     │   │  Load Balancer  │   │   US-EAST-1     │           │   │
│  │  │   Primary       │   │                 │   │   Backup        │           │   │
│  │  │                 │   │ • Health Checks │   │                 │           │   │
│  │  │ • FastAPI App   │◄──┤ • Auto Scaling  │──►│ • FastAPI App   │           │   │
│  │  │ • SQLite DB     │   │ • SSL Termination│   │ • SQLite DB     │           │   │
│  │  │ • Auto-scaling  │   │                 │   │ • Auto-scaling  │           │   │
│  │  └─────────────────┘   └─────────────────┘   └─────────────────┘           │   │
│  │                                                                             │   │
│  │  Features:                                                                  │   │
│  │  • Docker Container Deployment                                             │   │
│  │  • Automatic Scaling (0-100 instances)                                     │   │
│  │  • Health Checks & Auto-restart                                            │   │
│  │  • Environment Variable Management                                         │   │
│  │  • Persistent Volume for Database                                          │   │
│  │  • CI/CD Integration                                                       │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 **Deployment Configurations**

### **Frontend Deployment (Vercel)**

Create these files in your frontend directory:

**`vercel.json`**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-railway-app.railway.app/api/v1"
  },
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.railway.app/api/$1"
    }
  ]
}
```

**`.env.local`**
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api/v1
NEXT_PUBLIC_APP_ENV=production
```

### **Backend Deployment (Railway)**

**`railway.toml`**
```toml
[build]
builder = "DOCKERFILE"
buildCommand = "pip install uv && uv pip install -e ."

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
PORT = "8000"
DATABASE_URL = "sqlite:///./leave_management.db"
PYTHONPATH = "."
```

**`Dockerfile.railway`**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml ./
COPY uv.lock ./

# Install dependencies
RUN uv pip install -e .

# Copy application code
COPY . .

# Create database directory
RUN mkdir -p /app/data

# Set environment variables
ENV DATABASE_URL=sqlite:///./data/leave_management.db
ENV PORT=8000
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **📈 Scaling Strategy (50 → 500 → 5000 employees)**

```
<code_block_to_apply_changes_from>
```

## 🚀 **Deployment Steps**

### **1. Vercel Frontend Deployment**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to frontend directory
cd frontend

# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api/v1
```

### **2. Railway Backend Deployment**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Set environment variables
railway variables set DATABASE_URL=sqlite:///./data/leave_management.db
railway variables set PORT=8000
```

### **3. Environment Configuration**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://leave-mgmt-backend.railway.app/api/v1
NEXT_PUBLIC_APP_ENV=production

# Backend (Railway Variables)
DATABASE_URL=sqlite:///./data/leave_management.db
PORT=8000
PYTHONPATH=/app
CORS_ORIGINS=https://leave-mgmt-frontend.vercel.app
```

## 📊 **Performance & Monitoring**

### **Performance Targets**
- **Frontend (Vercel)**:
  - First Contentful Paint: < 1.2s
  - Bundle Size: < 250KB gzipped
  - Lighthouse Score: > 90

- **Backend (Railway)**:
  - API Response Time: < 200ms
  - Uptime: 99.9%
  - Auto-scaling: 0-10 instances

### **Monitoring Stack**
- **Vercel Analytics**: Performance monitoring
- **Railway Metrics**: Server monitoring
- **Uptime Robot**: External monitoring
- **Sentry**: Error tracking (future)

This HLD provides a complete deployment strategy for scaling from 50 to 5000+ employees with clear migration paths and cost projections!