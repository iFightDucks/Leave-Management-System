# 🏢 Leave Management System

A comprehensive **Leave Management System MVP** built for startups with 50-500 employees. This full-stack application provides HR teams with powerful tools to manage employee leave requests, track balances, and streamline approval workflows.

![Leave Management System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Deployment](https://img.shields.io/badge/Deployed%20on-Railway-7B68EE)

## 🌟 Features

### 👥 **Employee Management**
- ✅ Add employees with comprehensive details (Name, Email, Department, Joining Date)
- ✅ Automatic leave entitlement calculation based on joining date
- ✅ Employee profile with leave history and current balance
- ✅ Department-wise employee organization

### 📝 **Leave Request System**
- ✅ Apply for leave with date range and reason
- ✅ Real-time leave balance validation
- ✅ Prevent overlapping leave requests
- ✅ Historical leave request tracking

### ⚡ **Approval Workflow**
- ✅ Pending requests dashboard for HR
- ✅ One-click approve/reject functionality
- ✅ Approval tracking with timestamps and approver details
- ✅ Email notification system (ready for integration)

### 📊 **Analytics & Reporting**
- ✅ Real-time dashboard with key metrics
- ✅ Employee leave balance tracking
- ✅ Department-wise leave statistics
- ✅ Recent activity monitoring

### 🛡️ **Robust Validation**
- ✅ **Date Validation**: Prevent past-date applications, future joining dates
- ✅ **Balance Validation**: Cannot apply for more days than available
- ✅ **Overlap Prevention**: Detect and prevent conflicting leave requests
- ✅ **Business Logic**: Prorated leave calculation, weekend handling

## 🚀 Live Demo

- **🌐 Frontend**: [https://genuine-delight-production.up.railway.app](https://genuine-delight-production.up.railway.app)
- **🔗 Backend API**: [https://leave-management-system-production-1003.up.railway.app](https://leave-management-system-production-1003.up.railway.app)
- **📚 API Documentation**: [https://leave-management-system-production-1003.up.railway.app/docs](https://leave-management-system-production-1003.up.railway.app/docs)

## 🏗️ Architecture & Code Structure

### **High-Level System Design**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │───▶│   FastAPI       │───▶│  PostgreSQL     │
│   Frontend      │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
│ ├── Dashboard   │    │ ├── Employee    │    │ ├── employees   │
│ ├── Employees   │    │ │   Management  │    │ ├── leave_reqs  │
│ ├── Leaves      │    │ ├── Leave Mgmt  │    │ └── indexes     │
│ └── Real-time   │    │ ├── Validation  │    │                 │
│     Updates     │    │ └── APIs        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **📁 Project Structure**

```
leave-management-system/
├── 🐍 Backend (FastAPI)
│   ├── app/
│   │   ├── __init__.py           # Package initialization
│   │   ├── main.py               # FastAPI app & middleware setup
│   │   ├── models.py             # SQLAlchemy ORM models
│   │   ├── schemas.py            # Pydantic request/response models
│   │   ├── routes.py             # API endpoint definitions
│   │   ├── services.py           # Business logic layer
│   │   └── database.py           # Database connection & session
│   ├── tests/                    # Comprehensive test suite
│   ├── pyproject.toml            # Python dependencies & config
│   ├── Dockerfile                # Container configuration
│   └── run_dev.py               # Development server script
│
├── ⚛️ Frontend (Next.js)
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── dashboard/        # Dashboard page & components
│   │   │   ├── employees/        # Employee management pages
│   │   │   └── leaves/           # Leave management pages
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # Shadcn/ui base components
│   │   │   ├── dashboard/        # Dashboard-specific components
│   │   │   ├── employees/        # Employee-specific components
│   │   │   └── leaves/           # Leave-specific components
│   │   ├── hooks/                # Custom React hooks for API
│   │   ├── lib/                  # Utility functions & configurations
│   │   │   ├── api.ts            # Axios HTTP client setup
│   │   │   ├── types.ts          # TypeScript interface definitions
│   │   │   ├── utils.ts          # Utility functions (cn, etc.)
│   │   │   └── validations.ts    # Zod validation schemas
│   │   └── providers.tsx         # React context providers
│   ├── package.json              # Node.js dependencies
│   └── next.config.ts            # Next.js configuration
│
└── 📚 Documentation
    ├── README.md                 # Comprehensive project documentation
    └── .env.example              # Environment variables template
```

## 💻 Code Architecture Explained

### **🐍 Backend Architecture (FastAPI)**

#### **1. `app/main.py` - Application Entry Point**
```python
# FastAPI app initialization with CORS, exception handlers, and middleware
app = FastAPI(title="Leave Management System", version="1.0.0")

# CORS configuration for frontend communication
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Global exception handling for clean error responses
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

# Health check endpoint for monitoring
@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Database initialization on startup
@app.on_event("startup")
async def startup_event():
    create_tables()  # Auto-create database tables
```

#### **2. `app/models.py` - Database Models (SQLAlchemy ORM)**
```python
# Employee table with comprehensive fields and constraints
class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)  # Unique constraint
    department = Column(String(50), nullable=False)
    joining_date = Column(Date, nullable=False)
    annual_leave_entitlement = Column(Float, default=25.0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Leave request table with status tracking and foreign keys
class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False, index=True)  # Foreign key to Employee
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days_requested = Column(Float, nullable=False)
    status = Column(SQLEnum(LeaveStatus), default=LeaveStatus.PENDING)
    applied_date = Column(DateTime, default=datetime.utcnow)
    processed_by = Column(String(100))  # Who approved/rejected
```

#### **3. `app/schemas.py` - Request/Response Validation (Pydantic)**
```python
# Employee creation with validation rules
class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr  # Email format validation
    department: str = Field(..., min_length=2, max_length=50)
    joining_date: date
    annual_leave_entitlement: Optional[float] = Field(default=25.0, ge=0, le=365)

# Leave request with business logic validation
class LeaveRequestCreate(BaseModel):
    employee_id: int
    start_date: date
    end_date: date
    reason: Optional[str] = Field(None, max_length=500)

    @validator('end_date')
    def validate_date_range(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('End date must be after start date')
        return v
```

#### **4. `app/services.py` - Business Logic Layer**
```python
class EmployeeService:
    @staticmethod
    def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
        # Business rule: Check for duplicate email
        if EmployeeService.get_employee_by_email(db, employee_data.email):
            raise ValueError("Employee with this email already exists")
        
        # Business rule: Joining date cannot be in future
        if employee_data.joining_date > date.today():
            raise ValueError("Joining date cannot be in the future")
        
        # Create and save employee
        employee = Employee(**employee_data.dict())
        db.add(employee)
        db.commit()
        return employee

class LeaveService:
    @staticmethod
    def apply_leave(db: Session, leave_data: LeaveRequestCreate) -> LeaveRequest:
        # Business rule: Cannot apply before joining
        employee = EmployeeService.get_employee_by_id(db, leave_data.employee_id)
        if leave_data.start_date < employee.joining_date:
            raise ValueError("Cannot apply for leave before joining date")
        
        # Business rule: Check overlapping requests
        if LeaveService.check_overlapping_requests(db, leave_data.employee_id, 
                                                 leave_data.start_date, leave_data.end_date):
            raise ValueError("Leave request overlaps with existing request")
        
        # Business rule: Check sufficient leave balance
        days_requested = LeaveService.calculate_leave_days(leave_data.start_date, leave_data.end_date)
        leave_balance = LeaveService.get_leave_balance(db, leave_data.employee_id)
        if days_requested > leave_balance["available_days"]:
            raise ValueError(f"Insufficient leave balance")
        
        # Create leave request
        leave_request = LeaveRequest(**leave_data.dict(), days_requested=days_requested)
        db.add(leave_request)
        db.commit()
        return leave_request
```

#### **5. `app/routes.py` - API Endpoints**
```python
# Employee management endpoints
@router.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    try:
        employee = EmployeeService.create_employee(db, employee_data)
        return employee
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Leave request endpoints with business logic
@router.post("/leave-requests", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
async def apply_leave(leave_data: LeaveRequestCreate, db: Session = Depends(get_db)):
    try:
        leave_request = LeaveService.apply_leave(db, leave_data)
        return leave_request
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### **⚛️ Frontend Architecture (Next.js 15)**

#### **1. `src/app/layout.tsx` - Root Layout**
```typescript
// Global layout with providers and metadata
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>  {/* TanStack Query provider */}
      </body>
    </html>
  )
}
```

#### **2. `src/lib/api.ts` - HTTP Client Configuration**
```typescript
// Axios instance with interceptors for centralized HTTP handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
```

#### **3. `src/hooks/use-employees.ts` - Custom React Hooks**
```typescript
// TanStack Query hooks for server state management
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employees')
      return response.data
    }
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmployeeData) => api.post('/employees', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })  // Auto-refresh data
    }
  })
}
```

#### **4. `src/components/employees/employee-form.tsx` - Form Components**
```typescript
// React Hook Form with Zod validation
export function EmployeeForm() {
  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),  // Zod validation integration
    defaultValues: {
      name: '', email: '', department: '', joining_date: '', annual_leave_entitlement: 25
    }
  })

  const createEmployee = useCreateEmployee()

  const onSubmit = async (data: CreateEmployeeFormData) => {
    try {
      await createEmployee.mutateAsync(data)
      router.push('/employees')  // Navigate on success
    } catch (error) {
      console.error('Error creating employee:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields with validation */}
      </form>
    </Form>
  )
}
```

#### **5. `src/lib/validations.ts` - Validation Schemas**
```typescript
// Zod schemas for client-side validation (matches backend Pydantic)
export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  department: z.string().min(2).max(50),
  joining_date: z.string().refine((date) => {
    const parsedDate = new Date(date)
    const today = new Date()
    return !isNaN(parsedDate.getTime()) && parsedDate <= today
  }, 'Joining date cannot be in the future'),
  annual_leave_entitlement: z.number().min(0).max(365)
})
```

### **🔄 Data Flow Architecture**

```
User Action → Form Validation → API Call → Business Logic → Database → Response → UI Update
     ↓              ↓              ↓             ↓            ↓           ↓         ↓
 Click Submit → Zod Schema → Axios HTTP → Service Layer → SQLAlchemy → JSON → TanStack Query
```

### **🛡️ Security & Validation Layers**

1. **Frontend Validation**: Zod schemas with TypeScript
2. **API Validation**: Pydantic models with custom validators
3. **Business Logic**: Service layer with domain rules
4. **Database Constraints**: SQLAlchemy with unique/foreign key constraints
5. **HTTP Security**: CORS, input sanitization, error handling

## 🏗️ High-Level Design (HLD) Diagram

The following diagram illustrates the complete system architecture, data flow, and deployment infrastructure:

```mermaid
graph TB
    %% User Layer
    subgraph "👥 Users"
        HR[HR Administrator]
        EMP[Employees]
    end

    %% Frontend Layer
    subgraph "⚛️ Frontend (Next.js 15)"
        subgraph "🎨 UI Components"
            DASH[Dashboard]
            EMPUI[Employee Management]
            LEAVEUI[Leave Management]
            FORMS[Forms & Validation]
        end
        
        subgraph "🔧 Frontend Services"
            HOOKS[React Hooks<br/>TanStack Query]
            API_CLIENT[Axios HTTP Client]
            VALIDATION[Zod Validation]
            STATE[State Management]
        end
    end

    %% API Gateway / Load Balancer
    LB[🔄 Load Balancer<br/>Railway Proxy]

    %% Backend Layer
    subgraph "🐍 Backend (FastAPI)"
        subgraph "🌐 API Layer"
            HEALTH[Health Check]
            EMP_API[Employee APIs]
            LEAVE_API[Leave APIs]
            CORS[CORS Middleware]
        end
        
        subgraph "🧠 Business Logic"
            EMP_SVC[Employee Service]
            LEAVE_SVC[Leave Service]
            VALIDATORS[Pydantic Validators]
        end
        
        subgraph "💾 Data Access"
            ORM[SQLAlchemy ORM]
            DB_SESSION[DB Session Manager]
        end
    end

    %% Database Layer
    subgraph "🗄️ Database (PostgreSQL)"
        EMPLOYEES[(employees table)]
        LEAVE_REQUESTS[(leave_requests table)]
        INDEXES[Database Indexes]
    end

    %% Deployment Infrastructure
    subgraph "☁️ Railway Cloud"
        subgraph "Frontend Service"
            FE_CONTAINER[Next.js Container]
            FE_DOMAIN[genuine-delight-production<br/>.up.railway.app]
        end
        
        subgraph "Backend Service"
            BE_CONTAINER[FastAPI Container]
            BE_DOMAIN[leave-management-system<br/>-production-1003<br/>.up.railway.app]
        end
        
        subgraph "Database Service"
            PG_SERVICE[PostgreSQL Service]
            BACKUPS[Automatic Backups]
        end
    end

    %% External Services
    subgraph "🔧 External Services"
        GITHUB[GitHub Repository]
        DOCKER_REG[Docker Registry]
    end

    %% User Interactions
    HR --> DASH
    HR --> EMPUI
    HR --> LEAVEUI
    EMP --> LEAVEUI
    EMP --> FORMS

    %% Frontend Flow
    DASH --> HOOKS
    EMPUI --> HOOKS
    LEAVEUI --> HOOKS
    FORMS --> VALIDATION
    HOOKS --> API_CLIENT
    VALIDATION --> API_CLIENT
    API_CLIENT --> STATE

    %% API Communication
    API_CLIENT -.->|HTTPS Requests| LB
    LB --> CORS

    %% Backend Flow
    CORS --> EMP_API
    CORS --> LEAVE_API
    CORS --> HEALTH
    EMP_API --> VALIDATORS
    LEAVE_API --> VALIDATORS
    VALIDATORS --> EMP_SVC
    VALIDATORS --> LEAVE_SVC
    EMP_SVC --> ORM
    LEAVE_SVC --> ORM
    ORM --> DB_SESSION

    %% Database Operations
    DB_SESSION --> EMPLOYEES
    DB_SESSION --> LEAVE_REQUESTS
    EMPLOYEES -.->|Foreign Key| LEAVE_REQUESTS
    INDEXES --> EMPLOYEES
    INDEXES --> LEAVE_REQUESTS

    %% Deployment Flow
    FE_CONTAINER --> FE_DOMAIN
    BE_CONTAINER --> BE_DOMAIN
    PG_SERVICE --> BACKUPS
    GITHUB -.->|Auto Deploy| FE_CONTAINER
    GITHUB -.->|Auto Deploy| BE_CONTAINER
    DOCKER_REG -.->|Pull Images| BE_CONTAINER

    %% Database Connections
    BE_CONTAINER -.->|DATABASE_URL| PG_SERVICE
    FE_CONTAINER -.->|NEXT_PUBLIC_API_URL| BE_DOMAIN

    %% Styling
    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef frontendClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef databaseClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef cloudClass fill:#e3f2fd,stroke:#0d47a1,stroke-width:2px
    classDef externalClass fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class HR,EMP userClass
    class DASH,EMPUI,LEAVEUI,FORMS,HOOKS,API_CLIENT,VALIDATION,STATE frontendClass
    class HEALTH,EMP_API,LEAVE_API,CORS,EMP_SVC,LEAVE_SVC,VALIDATORS,ORM,DB_SESSION backendClass
    class EMPLOYEES,LEAVE_REQUESTS,INDEXES databaseClass
    class FE_CONTAINER,FE_DOMAIN,BE_CONTAINER,BE_DOMAIN,PG_SERVICE,BACKUPS,LB cloudClass
    class GITHUB,DOCKER_REG externalClass
```

### **📊 Database Schema Design**

```sql
-- Employees Table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    annual_leave_entitlement FLOAT DEFAULT 25.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested FLOAT NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP,
    processed_by VARCHAR(100)
);

-- Indexes for Performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
```

### **🔄 System Flow Breakdown**

#### **1. Employee Creation Flow**
```
HR fills form → Zod validation → API call → Pydantic validation → 
Business rules check → SQLAlchemy ORM → PostgreSQL → Response → 
TanStack Query cache update → UI refresh
```

#### **2. Leave Application Flow**
```
Employee submits → Date validation → Overlap check → Balance validation → 
Database insert → Email notification (future) → Dashboard update
```

#### **3. Leave Approval Flow**
```
HR views pending → Click approve/reject → Confirmation dialog → 
API call with approver → Status update → Timestamp recording → 
Cache invalidation → Real-time UI update
```

#### **4. Data Synchronization**
```
User action → Optimistic updates → Server validation → 
Database transaction → Success/Error response → 
Cache synchronization → UI state reconciliation
```

## 🛠️ Technology Stack

### **Backend**
- **Framework**: FastAPI 0.104+ (Python 3.11+)
- **ORM**: SQLAlchemy 2.0+ with declarative models
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Validation**: Pydantic 2.5+ with custom validators
- **Package Manager**: UV (ultra-fast Python package installer)
- **Testing**: Pytest with async support (21 test cases)

### **Frontend**
- **Framework**: Next.js 15.4 with App Router
- **React**: React 19 with Server Components
- **Language**: TypeScript 5.x with strict mode
- **Styling**: Tailwind CSS v4 (CSS-first approach)
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query v5 (server state) + Zustand (client state)
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Animations**: Framer Motion

### **Development Tools**
- **Containerization**: Docker with multi-stage builds
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Pytest (backend), Vitest (frontend), React Testing Library
- **API Testing**: FastAPI auto-generated OpenAPI docs
- **Version Control**: Git with conventional commits

### **Deployment & DevOps**
- **Platform**: Railway (auto-deployment from GitHub)
- **Database**: Railway PostgreSQL with automatic backups
- **SSL**: Automatic HTTPS certificates
- **Monitoring**: Railway built-in metrics and logging
- **CI/CD**: GitHub integration with automatic deployments

## 📦 Detailed Setup Instructions

### **Prerequisites**
- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **UV package manager** ([Install UV](https://github.com/astral-sh/uv))
- **npm** (comes with Node.js)
- **Git** for version control
- **PostgreSQL** (for production) / SQLite (for development)
- **Docker** (optional, for containerized deployment)

### **🐍 Backend Setup (FastAPI)**

#### **Step 1: Clone and Setup Repository**
```bash
# Clone the repository
git clone https://github.com/your-username/leave-management-system.git
cd leave-management-system

# Verify UV installation
uv --version
```

#### **Step 2: Create Python Environment**
```bash
# Create virtual environment
uv venv

# Activate virtual environment
# On Windows (Git Bash/PowerShell):
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
```

#### **Step 3: Install Dependencies**
```bash
# Install all dependencies
uv pip install -e .

# Verify installation
uv pip list
```

#### **Step 4: Database Setup**
```bash
# Create database tables (SQLite for development)
uv run python -c "from app.database import create_tables; create_tables()"

# Verify tables created
ls -la *.db  # Should show leave_management.db
```

#### **Step 5: Run Backend Server**
```bash
# Start development server
uv run python run_dev.py

# Alternative: Direct uvicorn
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will be available at:** `http://localhost:8000`
**API Documentation:** `http://localhost:8000/docs`

### **⚛️ Frontend Setup (Next.js)**

#### **Step 1: Navigate to Frontend Directory**
```bash
cd frontend
```

#### **Step 2: Install Dependencies**
```bash
# Install dependencies
npm install
```

#### **Step 3: Environment Configuration**
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
```

#### **Step 4: Run Frontend Server**
```bash
# Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:3000`

### **🔧 Environment Variables Configuration**

#### **Backend Environment (`.env`)**
```env
# Database Configuration
DATABASE_URL=sqlite:///./leave_management.db
# For PostgreSQL: DATABASE_URL=postgresql://username:password@localhost:5432/leave_management

# Application Settings
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000

# Optional: Email Configuration (for future notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
```

#### **Frontend Environment (`.env.local`)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: Analytics and Monitoring
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
# NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### **🧪 Verification Steps**

#### **1. Backend Health Check**
```bash
curl http://localhost:8000/api/v1/health
# Expected: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

#### **2. Create Test Employee**
```bash
curl -X POST "http://localhost:8000/api/v1/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Employee",
    "email": "test@company.com",
    "department": "Engineering",
    "joining_date": "2024-01-15",
    "annual_leave_entitlement": 25
  }'
```

#### **3. Frontend Verification**
- Visit `http://localhost:3000`
- Navigate to "Add Employee" page
- Create an employee through the UI
- Verify it appears in the employee list

### **🚀 Production Deployment Setup**

#### **Railway Deployment (Recommended)**

1. **Backend Deployment:**
   ```bash
   # Environment variables in Railway
   DATABASE_URL=postgresql://... (auto-provided)
   ENVIRONMENT=production
   FRONTEND_URL=https://your-frontend.railway.app
   ```

2. **Frontend Deployment:**
   ```bash
   # Environment variables in Railway
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   NODE_ENV=production
   ```

#### **Docker Deployment**
```bash
# Build and run backend
docker build -t leave-management-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL="your-postgres-url" \
  -e ENVIRONMENT="production" \
  leave-management-backend

# Build and run frontend
cd frontend
docker build -t leave-management-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="https://your-backend-url/api/v1" \
  leave-management-frontend
```

## 🧠 System Assumptions

### **Business Logic Assumptions**

1. **Leave Year Calculation:**
   - Annual leave year follows calendar year (January 1 - December 31)
   - Leave entitlement is prorated based on joining date within the year
   - Unused leave does not carry forward (configurable for future enhancement)

2. **Leave Entitlement:**
   - Default annual leave entitlement: 25 days
   - Leave entitlement can be customized per employee (0-365 days)
   - Half-day leave requests are supported (0.5 increments)
   - Weekend days are included in leave calculations (business requirement)

3. **Leave Request Rules:**
   - Employees can apply for future dates only (not past dates)
   - Leave requests cannot start before employee joining date
   - Maximum leave request duration: no specific limit (business decision)
   - Leave requests are processed in chronological order

4. **Approval Workflow:**
   - Single-level approval system (HR approves all requests)
   - No automatic approval based on leave type or duration
   - Once approved/rejected, leave requests cannot be modified
   - Approver identity is recorded for audit trail

### **Technical Assumptions**

1. **Database:**
   - SQLite for development (single-user scenario)
   - PostgreSQL for production (multi-user support)
   - Database migrations handled manually (future: Alembic integration)
   - Foreign key constraints enforced at database level

2. **Authentication:**
   - Current system has no user authentication (MVP scope)
   - All operations are performed by HR administrators
   - Employee self-service planned for future phases
   - API endpoints are publicly accessible (development only)

3. **Data Validation:**
   - Email addresses are unique across the system
   - Employee names allow international characters
   - Department names are free-text (no predefined list)
   - Date formats follow ISO 8601 standard (YYYY-MM-DD)

4. **Performance:**
   - System designed for 50-500 employees initially
   - No caching implemented in MVP (TanStack Query provides client-side caching)
   - Database queries optimized with strategic indexing
   - Real-time updates not required (30-second delay acceptable)

### **Infrastructure Assumptions**

1. **Deployment:**
   - Railway provides sufficient resources for MVP
   - PostgreSQL backup handled by Railway automatically
   - SSL/TLS certificates managed by hosting platform
   - Domain names provided by Railway (custom domains optional)

2. **Scalability:**
   - Vertical scaling sufficient for initial deployment
   - Horizontal scaling planned for enterprise growth
   - CDN not required for MVP (static assets served directly)
   - Load balancing handled by Railway platform

## 🛡️ Edge Cases Handled

### **Employee Management Edge Cases**

1. **Duplicate Email Prevention:**
   ```python
   # Backend validation
   if EmployeeService.get_employee_by_email(db, employee_data.email):
       raise ValueError("Employee with this email already exists")
   ```
   - **Scenario:** HR tries to add employee with existing email
   - **Handling:** Immediate validation with clear error message
   - **UI Response:** Form shows specific field error

2. **Future Joining Date Prevention:**
   ```python
   # Business rule validation
   if employee_data.joining_date > date.today():
       raise ValueError("Joining date cannot be in the future")
   ```
   - **Scenario:** HR enters future joining date
   - **Handling:** Server-side validation prevents invalid data
   - **UI Response:** Date picker restricts future dates

3. **Invalid Leave Entitlement:**
   ```python
   # Pydantic validation
   annual_leave_entitlement: float = Field(ge=0, le=365)
   ```
   - **Scenario:** Negative or excessive leave days entered
   - **Handling:** Input validation ensures 0-365 day range
   - **UI Response:** Form validation with helpful error message

### **Leave Request Edge Cases**

4. **Leave Before Joining Date:**
   ```python
   # Business logic check
   if leave_data.start_date < employee.joining_date:
       raise ValueError("Cannot apply for leave before joining date")
   ```
   - **Scenario:** Employee tries to apply for leave before starting work
   - **Handling:** Validation against employee joining date
   - **UI Response:** Date picker disabled for pre-joining dates

5. **Past Date Leave Applications:**
   ```python
   # Date validation
   if leave_data.start_date < date.today():
       raise ValueError("Cannot apply for leave in the past")
   ```
   - **Scenario:** Attempting to apply for yesterday's leave
   - **Handling:** Real-time date validation
   - **UI Response:** Calendar shows only future dates as selectable

6. **Overlapping Leave Requests:**
   ```python
   # Overlap detection algorithm
   def check_overlapping_requests(db, employee_id, start_date, end_date):
       existing_requests = db.query(LeaveRequest).filter(
           LeaveRequest.employee_id == employee_id,
           LeaveRequest.status.in_(['pending', 'approved']),
           or_(
               and_(LeaveRequest.start_date <= start_date, 
                    LeaveRequest.end_date >= start_date),
               and_(LeaveRequest.start_date <= end_date, 
                    LeaveRequest.end_date >= end_date),
               and_(LeaveRequest.start_date >= start_date, 
                    LeaveRequest.end_date <= end_date)
           )
       ).first()
       return existing_requests is not None
   ```
   - **Scenario:** Employee applies for leave during already approved/pending period
   - **Handling:** Complex date range overlap detection
   - **UI Response:** Calendar shows unavailable dates visually

7. **Insufficient Leave Balance:**
   ```python
   # Balance calculation and validation
   leave_balance = LeaveService.get_leave_balance(db, employee_id)
   if days_requested > leave_balance["available_days"]:
       raise ValueError(f"Insufficient leave balance. Available: {leave_balance['available_days']}")
   ```
   - **Scenario:** Requesting more days than available balance
   - **Handling:** Real-time balance calculation with validation
   - **UI Response:** Shows current balance and prevents over-application

8. **Invalid Date Range:**
   ```python
   # Pydantic validator
   @validator('end_date')
   def validate_date_range(cls, v, values):
       if 'start_date' in values and v < values['start_date']:
           raise ValueError('End date must be after start date')
       return v
   ```
   - **Scenario:** End date before start date
   - **Handling:** Cross-field validation in both frontend and backend
   - **UI Response:** Interactive date picker prevents invalid selections

### **Data Integrity Edge Cases**

9. **Employee Not Found:**
   ```python
   # Employee existence validation
   employee = EmployeeService.get_employee_by_id(db, leave_data.employee_id)
   if not employee:
       raise ValueError("Employee not found")
   ```
   - **Scenario:** Leave request for non-existent employee ID
   - **Handling:** Foreign key validation and existence check
   - **UI Response:** Employee dropdown only shows valid employees

10. **Database Connection Failures:**
    ```python
    # Database session management
    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    ```
    - **Scenario:** Database unavailable during operation
    - **Handling:** Proper session management and connection pooling
    - **UI Response:** User-friendly error message with retry option

11. **Concurrent Modification:**
    ```python
    # Transaction handling
    try:
        db.add(leave_request)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Request could not be processed due to concurrent modification")
    ```
    - **Scenario:** Multiple users modifying same data simultaneously
    - **Handling:** Database transactions with rollback on conflict
    - **UI Response:** Refresh data and ask user to retry

### **API and Network Edge Cases**

12. **Malformed Request Data:**
    ```python
    # Pydantic automatic validation
    class LeaveRequestCreate(BaseModel):
        employee_id: int
        start_date: date
        end_date: date
        reason: Optional[str] = Field(None, max_length=500)
    ```
    - **Scenario:** Invalid JSON or missing required fields
    - **Handling:** Automatic Pydantic validation with detailed error messages
    - **UI Response:** Form highlights specific validation errors

13. **Network Timeout:**
    ```typescript
    // Axios timeout configuration
    export const api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,  // 10 second timeout
    })
    ```
    - **Scenario:** Slow network or server response
    - **Handling:** Configurable timeout with retry mechanism
    - **UI Response:** Loading states and timeout error handling

## 🔮 Potential Improvements & Future Enhancements

### **Phase 1: Authentication & Authorization (High Priority)**

1. **User Authentication System:**
   ```python
   # Planned implementation
   from fastapi_users import FastAPIUsers
   from fastapi_users.authentication import JWTAuthentication
   
   # Employee login with JWT tokens
   # Role-based access control (HR vs Employee)
   # Password reset functionality
   ```
   - **Priority:** High
   - **Timeline:** 2-3 weeks
   - **Benefits:** Secure access, employee self-service
   - **Implementation:** FastAPI-Users with JWT tokens

2. **Role-Based Access Control:**
   - HR administrators: Full access to all features
   - Employees: Limited to personal leave requests
   - Managers: Approve requests for their team
   - API endpoint protection with role validation

3. **Session Management:**
   - Secure session handling
   - Automatic logout after inactivity
   - Multi-device login support
   - Remember me functionality

### **Phase 2: Enhanced User Experience (Medium Priority)**

4. **Email Notification System:**
   ```python
   # Email service integration
   from fastapi_mail import FastMail, MessageSchema
   
   # Notifications for:
   # - Leave request submissions
   # - Approval/rejection notifications
   # - Low balance warnings
   # - Upcoming leave reminders
   ```
   - **Integration:** SendGrid/SMTP
   - **Templates:** HTML email templates
   - **Preferences:** User-configurable notifications

5. **Advanced Dashboard Analytics:**
   - **Graphical Reports:** Chart.js integration for visualizations
   - **Department Analytics:** Leave patterns by department
   - **Seasonal Trends:** Peak leave periods identification
   - **Export Functionality:** PDF/Excel report generation

6. **Calendar Integration:**
   ```typescript
   // Calendar view implementation
   import FullCalendar from '@fullcalendar/react'
   
   // Features:
   // - Visual leave calendar
   // - Team availability view
   // - Holiday integration
   // - Conflict detection UI
   ```

7. **Mobile Responsiveness & PWA:**
   - Progressive Web App capabilities
   - Offline functionality for viewing data
   - Push notifications
   - Mobile-optimized UI components

### **Phase 3: Advanced Features (Medium Priority)**

8. **Leave Types & Policies:**
   ```python
   # Extended leave type system
   class LeaveType(Base):
       __tablename__ = "leave_types"
       id = Column(Integer, primary_key=True)
       name = Column(String(50))  # Sick, Vacation, Personal, etc.
       requires_approval = Column(Boolean, default=True)
       max_consecutive_days = Column(Integer)
       advance_notice_days = Column(Integer)
   ```
   - **Sick Leave:** Different rules and approval process
   - **Emergency Leave:** Immediate approval workflow
   - **Vacation Leave:** Planning and advance booking
   - **Parental Leave:** Extended duration support

9. **Multi-Level Approval Workflow:**
   ```python
   # Approval chain implementation
   class ApprovalWorkflow(Base):
       __tablename__ = "approval_workflows"
       id = Column(Integer, primary_key=True)
       employee_id = Column(Integer, ForeignKey("employees.id"))
       approver_1_id = Column(Integer, ForeignKey("employees.id"))  # Direct Manager
       approver_2_id = Column(Integer, ForeignKey("employees.id"))  # HR
       approval_order = Column(Integer)
   ```
   - **Manager Approval:** First level approval
   - **HR Approval:** Final approval for long leaves
   - **Delegation:** Approver can delegate to others
   - **Escalation:** Automatic escalation after timeout

10. **Holiday & Working Days Management:**
    ```python
    # Holiday calendar system
    class Holiday(Base):
        __tablename__ = "holidays"
        id = Column(Integer, primary_key=True)
        name = Column(String(100))
        date = Column(Date)
        is_recurring = Column(Boolean)
        applies_to_departments = Column(JSON)  # Department-specific holidays
    ```
    - **Public Holidays:** Automatic exclusion from leave calculations
    - **Regional Holidays:** Department/location-specific
    - **Working Days Configuration:** Custom weekend definitions

### **Phase 4: Enterprise Features (Lower Priority)**

11. **Advanced Reporting & Analytics:**
    ```python
    # Reporting engine
    from sqlalchemy import func
    
    # Advanced queries for:
    # - Leave utilization rates
    # - Department comparison reports
    # - Predictive analytics for staffing
    # - Compliance reporting
    ```
    - **Business Intelligence:** Power BI/Tableau integration
    - **Automated Reports:** Scheduled email reports
    - **Custom Dashboards:** Department-specific views
    - **Audit Trails:** Complete action history

12. **Integration Capabilities:**
    ```python
    # External system integrations
    # - HR Information Systems (BambooHR, Workday)
    # - Payroll Systems (ADP, Paychex)
    # - Calendar Systems (Google Calendar, Outlook)
    # - Slack/Teams notifications
    ```

13. **Advanced Performance & Scalability:**
    ```python
    # Performance optimizations
    from redis import Redis
    from celery import Celery
    
    # Caching layer with Redis
    # Background job processing
    # Database read replicas
    # API rate limiting
    ```

### **Phase 5: AI/ML Features (Future Innovation)**

14. **Intelligent Leave Planning:**
    - **ML Models:** Predict optimal leave timing
    - **Team Impact Analysis:** Staffing level optimization
    - **Smart Recommendations:** Suggest alternative dates
    - **Pattern Recognition:** Identify leave abuse patterns

15. **Automated Approval Suggestions:**
    ```python
    # ML-based approval recommendations
    from sklearn.ensemble import RandomForestClassifier
    
    # Features:
    # - Historical approval patterns
    # - Team capacity analysis
    # - Project deadline considerations
    # - Employee performance metrics
    ```

### **Technical Debt & Infrastructure Improvements**

16. **Database Optimizations:**
    ```sql
    -- Additional performance improvements
    CREATE INDEX CONCURRENTLY idx_leave_requests_status_dates 
    ON leave_requests(status, start_date, end_date);
    
    -- Partitioning for large datasets
    CREATE TABLE leave_requests_2024 PARTITION OF leave_requests
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
    ```

17. **Code Quality Enhancements:**
    ```python
    # Additional tooling
    # - Pre-commit hooks with Black, isort, mypy
    # - GitHub Actions CI/CD pipeline
    # - Automated security scanning
    # - Code coverage reporting (>90% target)
    ```

18. **Monitoring & Observability:**
    ```python
    # Comprehensive monitoring
    from prometheus_client import Counter, Histogram
    import structlog
    
    # Metrics: API response times, error rates, user activity
    # Logging: Structured JSON logs with correlation IDs
    # Alerting: PagerDuty integration for critical issues
    ```

### **Security Enhancements**

19. **Advanced Security Features:**
    ```python
    # Security improvements
    from fastapi_limiter import FastAPILimiter
    import hashlib
    
    # Rate limiting per user/IP
    # Input sanitization and validation
    # SQL injection prevention
    # XSS protection headers
    ```

20. **Compliance & Audit:**
    - **GDPR Compliance:** Data privacy and right to deletion
    - **SOC 2 Compliance:** Security and availability controls
    - **Audit Logging:** Complete activity trail
    - **Data Encryption:** At rest and in transit

### **Mobile Application**

21. **Native Mobile Apps:**
    ```typescript
    // React Native implementation
    // Features:
    // - Push notifications
    // - Offline data sync
    // - Biometric authentication
    // - Camera integration for documents
    ```

### **Implementation Roadmap**

| Phase | Priority | Timeline | Key Features |
|-------|----------|----------|--------------|
| **Phase 1** | High | 2-3 weeks | Authentication, Role-based access |
| **Phase 2** | Medium | 4-6 weeks | Email notifications, Calendar view |
| **Phase 3** | Medium | 6-8 weeks | Leave types, Multi-level approval |
| **Phase 4** | Lower | 8-12 weeks | Advanced reporting, Integrations |
| **Phase 5** | Future | 12+ weeks | AI/ML features, Predictive analytics |

### **Resource Requirements for Scaling**

```
Current (50 employees):     Target (500+ employees):
├── Single server          ├── Load-balanced cluster
├── SQLite/PostgreSQL      ├── PostgreSQL with read replicas
├── 512MB RAM             ├── 4GB+ RAM per service
├── Basic monitoring      ├── Full observability stack
└── Manual backups        └── Automated disaster recovery
```

### **Cost-Benefit Analysis**

| Improvement | Development Cost | Operational Benefit | ROI Timeline |
|-------------|------------------|-------------------|--------------|
| Authentication | 2-3 weeks | High security, self-service | 1 month |
| Email Notifications | 1 week | Reduced manual communication | 2 weeks |
| Mobile App | 8-12 weeks | Higher user adoption | 6 months |
| AI/ML Features | 16+ weeks | Predictive insights | 12+ months |

## 🧪 Testing

### **Backend Tests**
```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=app

# Run specific test file
uv run pytest tests/test_employees.py -v
```

**Test Coverage:**
- ✅ Employee CRUD operations
- ✅ Leave request business logic
- ✅ Edge case validations
- ✅ API endpoint integration
- ✅ Database operations

### **Frontend Tests**
```bash
cd frontend

# Run component tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📚 API Documentation

### **Core Endpoints**

#### **Employees**
```http
GET    /api/v1/employees                    # List all employees
POST   /api/v1/employees                    # Create employee
GET    /api/v1/employees/{id}               # Get employee details
PUT    /api/v1/employees/{id}               # Update employee
DELETE /api/v1/employees/{id}               # Delete employee
GET    /api/v1/employees/{id}/leave-balance # Get leave balance
GET    /api/v1/employees/{id}/leave-requests # Get employee's leave requests
```

#### **Leave Requests**
```http
GET    /api/v1/leave-requests               # List all leave requests
POST   /api/v1/leave-requests               # Apply for leave
GET    /api/v1/leave-requests/{id}          # Get leave request details
PUT    /api/v1/leave-requests/{id}/approve  # Approve leave request
PUT    /api/v1/leave-requests/{id}/reject   # Reject leave request
```

#### **System**
```http
GET    /api/v1/health                       # Health check
GET    /docs                                # Interactive API documentation
```

### **Sample API Calls**

**Create Employee:**
```bash
curl -X POST "http://localhost:8000/api/v1/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "joining_date": "2024-01-15",
    "annual_leave_entitlement": 25
  }'
```

**Apply for Leave:**
```bash
curl -X POST "http://localhost:8000/api/v1/leave-requests" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "start_date": "2025-02-15",
    "end_date": "2025-02-19",
    "reason": "Family vacation"
  }'
```

## 🚀 Deployment

### **Railway Deployment (Recommended)**

1. **Deploy Backend:**
   - Connect your GitHub repository to Railway
   - Railway auto-detects FastAPI application
   - Add PostgreSQL service
   - Set environment variables

2. **Deploy Frontend:**
   - Add frontend service with root directory: `frontend`
   - Set `NEXT_PUBLIC_API_URL` to backend URL
   - Railway auto-builds and deploys Next.js

### **Manual Deployment**

**Backend (Docker):**
```bash
# Build image
docker build -t leave-management-backend .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="your-postgres-url" \
  -e ENVIRONMENT="production" \
  leave-management-backend
```

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
npm start
```

## 🎯 Usage Guide

### **For HR Administrators**

1. **Employee Onboarding:**
   - Go to "Add Employee" page
   - Fill in employee details
   - System automatically calculates leave entitlement

2. **Leave Management:**
   - Monitor pending requests on dashboard
   - Review leave details and employee history
   - Approve or reject with one click

3. **Analytics:**
   - View real-time statistics on dashboard
   - Track department-wise leave patterns
   - Monitor leave balance utilization

### **For Employees (Future Enhancement)**

The system is architected for easy employee self-service extension:
- Personal dashboard with leave balance
- Self-service leave application
- Leave history and status tracking

## 🧠 Business Logic & Edge Cases

### **Leave Balance Calculation**
- **Prorated Entitlement**: New employees get proportional leave based on joining date
- **Annual Reset**: Leave balances reset on fiscal year boundary
- **Carry Forward**: Configurable unused leave carry-forward rules

### **Validation Rules**
- ❌ Cannot apply for leave before joining date
- ❌ Cannot apply for more days than available balance
- ❌ Cannot apply for overlapping date ranges
- ❌ Cannot apply for past dates
- ❌ End date must be after or equal to start date

### **Approval Workflow**
- 🔄 Pending → Approved/Rejected state transitions
- 📝 Audit trail with approver details and timestamps
- 🔔 Email notifications (ready for integration)

## 📈 Scaling Strategy

### **Current Capacity: 50 Employees**
- SQLite database (development)
- Single server deployment
- Basic caching with TanStack Query

### **Scaling to 500+ Employees**

**Database:**
- ✅ PostgreSQL with connection pooling
- ✅ Database indexing on foreign keys
- ✅ Read replicas for reporting queries

**Backend:**
- ✅ Horizontal scaling with load balancer
- ✅ Redis caching for frequently accessed data
- ✅ Background job processing with Celery

**Frontend:**
- ✅ CDN distribution
- ✅ Image optimization
- ✅ Code splitting and lazy loading

**Infrastructure:**
- ✅ Container orchestration (Kubernetes)
- ✅ Auto-scaling based on load
- ✅ Monitoring and alerting

## 🔮 Future Enhancements

### **Phase 1: Employee Self-Service**
- [ ] Employee login and authentication
- [ ] Self-service leave application
- [ ] Personal leave calendar
- [ ] Mobile responsive improvements

### **Phase 2: Advanced Features**
- [ ] Email/SMS notifications
- [ ] Multiple approval levels
- [ ] Leave types (sick, vacation, personal)
- [ ] Holiday calendar integration

### **Phase 3: Enterprise Features**
- [ ] Advanced reporting and analytics
- [ ] Integration with HR systems (BambooHR, Workday)
- [ ] API rate limiting and authentication
- [ ] Multi-tenant support

### **Phase 4: AI/ML Features**
- [ ] Leave pattern analysis
- [ ] Predictive leave planning
- [ ] Automated approval suggestions
- [ ] Workload balancing recommendations

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Standards**
- Follow PEP 8 for Python code
- Use TypeScript strict mode
- Write tests for new features
- Update documentation
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@domain.com

## 🙏 Acknowledgments

- FastAPI team for the excellent Python web framework
- Next.js team for the React framework
- Railway for seamless deployment platform
- Shadcn/ui for beautiful UI components
- TanStack Query for powerful data synchronization

---

**⭐ If you find this project helpful, please give it a star!**

Built with ❤️ for modern HR teams
