# Leave Management System

A Mini Leave Management System MVP built for startups with 50 employees using Python, FastAPI, and SQLite.

## Features

- **Employee Management**: Add employees with basic details
- **Leave Application**: Apply for leave with validation
- **Leave Approval/Rejection**: HR can approve or reject leave requests
- **Leave Balance Tracking**: Track available, used, and pending leave days
- **Comprehensive Validation**: Handle all edge cases and business rules

## Technology Stack

- **Backend**: Python 3.11+ with FastAPI
- **Database**: SQLite (development), PostgreSQL (production ready)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Testing**: Pytest
- **Package Management**: UV

## Setup Instructions

### Prerequisites
- Python 3.11+
- UV package manager

### Installation

1. **Install UV**:
   ```bash
   # macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # Windows
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd leave-management-system
   
   # Create virtual environment
   uv venv
   
   # Activate virtual environment
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   
   # Install dependencies
   uv pip install -e .
   uv pip install -e ".[dev]"
   ```

3. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   # OR
   python run_dev.py
   ```

4. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Employee Management
- `POST /api/v1/employees` - Create new employee
- `GET /api/v1/employees` - List all employees
- `GET /api/v1/employees/{id}` - Get employee by ID

### Leave Management
- `POST /api/v1/leave-requests` - Apply for leave
- `PUT /api/v1/leave-requests/{id}/approve` - Approve leave
- `PUT /api/v1/leave-requests/{id}/reject` - Reject leave
- `GET /api/v1/employees/{id}/leave-balance` - Get leave balance
- `GET /api/v1/employees/{id}/leave-requests` - Get employee's leave history

## Sample API Calls

### Create Employee
```bash
curl -X POST "http://localhost:8000/api/v1/employees" \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "joining_date": "2024-01-15"
}'
```

### Apply for Leave
```bash
curl -X POST "http://localhost:8000/api/v1/leave-requests" \
-H "Content-Type: application/json" \
-d '{
  "employee_id": 1,
  "start_date": "2024-03-01",
  "end_date": "2024-03-05",
  "reason": "Personal leave"
}'
```

### Approve Leave
```bash
curl -X PUT "http://localhost:8000/api/v1/leave-requests/1/approve?processed_by=HR Manager"
```

### Check Leave Balance
```bash
curl "http://localhost:8000/api/v1/employees/1/leave-balance"
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_employees.py

# Run tests with verbose output
pytest -v
```

## Edge Cases Handled

### 1. Date Validations
- ✅ Leave applied before joining date
- ✅ End date before start date
- ✅ Leave applied for past dates
- ✅ Future joining dates not allowed

### 2. Business Logic
- ✅ Insufficient leave balance
- ✅ Overlapping leave requests
- ✅ Duplicate employee emails
- ✅ Employee not found scenarios
- ✅ Processing already processed requests

### 3. Data Integrity
- ✅ Invalid employee data
- ✅ Malformed date formats
- ✅ Negative leave days
- ✅ Invalid email formats

### 4. Additional Edge Cases
- ✅ Prorated leave calculation for mid-year joiners
- ✅ Leave balance calculations with pending requests
- ✅ Maximum leave entitlement validation
- ✅ Concurrent leave request handling

## Assumptions

### 1. Leave Calculation
- Annual leave is prorated based on joining date within the current year
- Weekend days are counted as leave days (no business day calculation)
- Public holidays are not considered in this MVP
- Leave year follows calendar year

### 2. Business Rules
- Default annual leave entitlement: 25 days
- Only pending requests can be approved/rejected
- HR can apply leave on behalf of employees
- No minimum notice period enforced
- No maximum consecutive leave limit

### 3. Data Model
- Single leave type (annual leave) in this MVP
- No leave carry-forward policies implemented
- No manager approval hierarchy
- Simple approval workflow (HR only)

## Potential Improvements

### 1. Enhanced Features
- **Multiple Leave Types**: Sick leave, personal leave, maternity leave
- **Manager Approval Workflow**: Multi-level approval process
- **Leave Policies**: Carry-forward, encashment, negative balance
- **Calendar Integration**: Holiday calendar, business days calculation
- **Notifications**: Email/SMS notifications for status changes
- **Reports**: Leave analytics, department-wise reports

### 2. Technical Improvements
- **Authentication**: JWT-based authentication system
- **Authorization**: Role-based access control (RBAC)
- **Audit Logging**: Track all changes with timestamps
- **Background Tasks**: Async processing for notifications
- **File Uploads**: Support for leave documents/certificates
- **Bulk Operations**: Import/export employee data

### 3. Scalability (50 → 500+ employees)
- **Database Optimization**: Connection pooling, read replicas
- **Caching**: Redis for frequently accessed data
- **API Gateway**: Rate limiting, request routing
- **Microservices**: Separate services for employees, leaves, notifications
- **Event-Driven Architecture**: Message queues for decoupling
- **Monitoring**: Application metrics, logging, alerting

### 4. User Experience
- **Frontend Application**: React/Vue.js web interface
- **Mobile App**: React Native/Flutter mobile application
- **Dashboard**: Real-time analytics and insights
- **Self-Service**: Employee portal for leave management
- **Integration**: HRMS, payroll system integration

## High-Level System Design

### Current Architecture (MVP)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI App   │────│   SQLAlchemy    │────│     SQLite      │
│                 │    │      ORM        │    │    Database     │
│  - Routes       │    │                 │    │                 │
│  - Services     │    │  - Models       │    │  - employees    │
│  - Validation   │    │  - Sessions     │    │  - leave_req    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Scalable Architecture (500+ employees)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │     Frontend    │
│    (Nginx)      │────│   (Kong/AWS)    │────│   (React SPA)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Service   │    │  Leave Service  │    │ Employee Service│
│   (FastAPI)     │    │   (FastAPI)     │    │   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Redis Cache    │    │   PostgreSQL    │    │   Message Queue │
│   (Session)     │    │   (Primary DB)  │    │   (RabbitMQ)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Deployment

### Local Development
```bash
# Using uvicorn directly
uvicorn app.main:app --reload

# Using the dev script
python run_dev.py
```

### Production Deployment

#### Using Docker
```bash
# Build image
docker build -t leave-management .

# Run container
docker run -p 8000:8000 leave-management
```

#### Using Gunicorn (Production WSGI)
```bash
# Install gunicorn
uv pip install gunicorn

# Run with multiple workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UnicornWorker --bind 0.0.0.0:8000
```

#### Environment Variables (Production)
```bash
export DATABASE_URL="postgresql://user:pass@localhost/leavemgmt"
export SECRET_KEY="your-secret-key"
export ENVIRONMENT="production"
```

## Project Structure
```
leave-management-system/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── services.py          # Business logic
│   └── routes.py            # API endpoints
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test configuration
│   ├── test_employees.py    # Employee tests
│   ├── test_leave_requests.py # Leave request tests
│   └── test_services.py     # Service layer tests
├── pyproject.toml           # Project dependencies
├── Dockerfile              # Docker configuration
├── run_dev.py              # Development server
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Run tests (`pytest`)
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature/new-feature`)
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation at `/docs` endpoint

---

**Note**: This is an MVP implementation. For production use, consider implementing additional security measures, monitoring, and scaling improvements mentioned in the "Potential Improvements" section.
