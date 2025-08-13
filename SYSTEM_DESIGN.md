# Leave Management System - High Level Design

## Overview
This document outlines the system design for the Mini Leave Management System MVP, including current architecture and scalability considerations.

## Current MVP Architecture

### Technology Stack
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Testing**: Pytest
- **Package Management**: UV

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (FastAPI)                      │
├─────────────────────────────────────────────────────────────┤
│  /api/v1/employees          │  /api/v1/leave-requests       │
│  - POST /employees          │  - POST /leave-requests       │
│  - GET /employees           │  - PUT /{id}/approve           │
│  - GET /employees/{id}      │  - PUT /{id}/reject           │
│                             │  - GET /{id}/leave-balance    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  EmployeeService            │  LeaveService                 │
│  - create_employee()        │  - apply_leave()              │
│  - get_employee_by_id()     │  - update_leave_status()      │
│  - get_employee_by_email()  │  - get_leave_balance()        │
│                             │  - check_overlapping()        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  SQLAlchemy Models          │  Database Schema              │
│  - Employee                 │  employees table              │
│  - LeaveRequest             │  leave_requests table         │
│  - LeaveStatus (Enum)       │                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database                                │
│                  SQLite (MVP)                               │
│               PostgreSQL (Production)                       │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Employee Table
```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    annual_leave_entitlement REAL DEFAULT 25.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Leave Request Table
```sql
CREATE TABLE leave_requests (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested REAL NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending',
    applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    processed_by VARCHAR(100)
);
```

## API Design

### Employee Management APIs
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/v1/employees` | Create employee | EmployeeCreate | EmployeeResponse |
| GET | `/api/v1/employees` | List employees | Query params | List[EmployeeResponse] |
| GET | `/api/v1/employees/{id}` | Get employee | - | EmployeeResponse |

### Leave Management APIs
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/v1/leave-requests` | Apply leave | LeaveRequestCreate | LeaveRequestResponse |
| PUT | `/api/v1/leave-requests/{id}/approve` | Approve leave | Query: processed_by | LeaveRequestResponse |
| PUT | `/api/v1/leave-requests/{id}/reject` | Reject leave | Query: processed_by | LeaveRequestResponse |
| GET | `/api/v1/employees/{id}/leave-balance` | Get balance | - | LeaveBalance |
| GET | `/api/v1/employees/{id}/leave-requests` | Get history | - | List[LeaveRequestResponse] |

## Business Logic & Validations

### Employee Validations
- ✅ Email uniqueness check
- ✅ Future joining date validation
- ✅ Required field validation
- ✅ Email format validation

### Leave Request Validations
- ✅ Employee existence check
- ✅ Leave before joining date
- ✅ Past date application
- ✅ End date before start date
- ✅ Overlapping requests
- ✅ Insufficient balance
- ✅ Prorated leave calculation

### Business Rules
- Annual leave prorated for mid-year joiners
- Only pending requests can be processed
- Leave balance considers approved + pending requests
- Weekend/holiday counting (simplified - all days count)

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful GET/PUT operations
- `201 Created` - Successful POST operations
- `400 Bad Request` - Validation errors, business rule violations
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Unexpected server errors

### Error Response Format
```json
{
  "error": "Validation Error",
  "detail": "End date must be after start date",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Scalability Design (50 → 500+ employees)

### Phase 1: Optimized Monolith (50-100 employees)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   FastAPI App   │    │   PostgreSQL    │
│  (Static files) │────│  (Gunicorn +    │────│   (Primary)     │
│  (Load Balance) │    │   4 workers)    │    │   + Read Replica│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │ (Session/Data)  │
                       └─────────────────┘
```

### Phase 2: Microservices (500+ employees)
```
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (Kong/AWS)    │
                    └─────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │Auth Service │ │Leave Service│ │Employee Svc │
    │  (FastAPI)  │ │  (FastAPI)  │ │  (FastAPI)  │
    └─────────────┘ └─────────────┘ └─────────────┘
            │               │               │
            ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │Redis Session│ │PostgreSQL   │ │PostgreSQL   │
    │   Cache     │ │ (Leaves DB) │ │(Employee DB)│
    └─────────────┘ └─────────────┘ └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │Message Queue│
                    │ (RabbitMQ)  │
                    └─────────────┘
```

### Scaling Components

#### Database Scaling
1. **Connection Pooling**: SQLAlchemy connection pool (10-20 connections)
2. **Read Replicas**: Separate read operations for reporting
3. **Indexing**: Strategic indexes on frequently queried columns
4. **Partitioning**: Time-based partitioning for leave_requests table

#### Application Scaling
1. **Horizontal Scaling**: Multiple FastAPI instances behind load balancer
2. **Caching**: Redis for frequently accessed data (employee info, leave balances)
3. **Async Processing**: Background jobs for notifications, reports
4. **Rate Limiting**: API rate limiting to prevent abuse

#### Infrastructure Scaling
1. **Load Balancer**: Nginx/HAProxy for request distribution
2. **CDN**: Static asset delivery
3. **Monitoring**: Prometheus + Grafana for metrics
4. **Logging**: Centralized logging with ELK stack

## Deployment Architecture

### Development Environment
```bash
# Local development
uvicorn app.main:app --reload --port 8000
```

### Production Environment
```bash
# Production deployment
gunicorn app.main:app -w 4 -k uvicorn.workers.UnicornWorker
```

### Container Deployment (Docker)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install uv
COPY pyproject.toml .
RUN uv pip install -e .
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment Options
1. **Railway/Render**: Simple deployment for MVP
2. **AWS ECS/Fargate**: Container orchestration
3. **Kubernetes**: Full microservices deployment
4. **Serverless**: AWS Lambda + API Gateway

## Security Considerations

### Current MVP Security
- Input validation with Pydantic
- SQL injection prevention via SQLAlchemy ORM
- CORS middleware configuration
- Basic error handling without data leaks

### Production Security Enhancements
1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (HR, Manager, Employee)
3. **Rate Limiting**: API throttling to prevent DoS
4. **HTTPS**: TLS encryption for all communications
5. **Audit Logging**: Track all data modifications
6. **Data Encryption**: Sensitive data encryption at rest

## Monitoring & Observability

### Application Metrics
- Request latency and throughput
- Error rates by endpoint
- Database query performance
- Cache hit/miss ratios

### Business Metrics
- Leave application rates
- Approval/rejection rates
- Average processing time
- Leave balance utilization

### Alerting
- High error rates
- Database connection issues
- Slow query performance
- System resource utilization

## Testing Strategy

### Unit Tests
- Service layer business logic
- Validation rules
- Edge case handling
- Database operations

### Integration Tests
- API endpoint testing
- Database integration
- Error handling flows
- Authentication/authorization

### Performance Tests
- Load testing with concurrent users
- Database performance under load
- Cache performance validation
- Memory usage optimization

## Future Enhancements

### Features
1. **Multi-tenant Support**: Support multiple companies
2. **Advanced Leave Types**: Sick, maternity, study leave
3. **Approval Workflows**: Manager → HR approval chains
4. **Calendar Integration**: Google Calendar, Outlook sync
5. **Mobile Application**: React Native mobile app
6. **Reporting Dashboard**: Analytics and insights

### Technical Improvements
1. **Event-Driven Architecture**: Domain events for decoupling
2. **CQRS Pattern**: Separate read/write models
3. **GraphQL API**: Flexible client queries
4. **Real-time Updates**: WebSocket notifications
5. **Machine Learning**: Leave pattern analysis
6. **Blockchain**: Immutable audit trail

This design provides a solid foundation for the MVP while maintaining clear paths for scaling and enhancement as the organization grows.
