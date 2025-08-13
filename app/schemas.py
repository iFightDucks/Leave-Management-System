from pydantic import BaseModel, EmailStr, validator, Field
from datetime import date, datetime
from typing import Optional
from enum import Enum

class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=50)
    joining_date: date
    annual_leave_entitlement: Optional[float] = Field(default=25.0, ge=0, le=365)

class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    department: str
    joining_date: date
    annual_leave_entitlement: float
    created_at: datetime

    class Config:
        from_attributes = True

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

class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    start_date: date
    end_date: date
    days_requested: float
    reason: Optional[str]
    status: LeaveStatus
    applied_date: datetime
    processed_date: Optional[datetime]
    processed_by: Optional[str]

    class Config:
        from_attributes = True

class LeaveRequestUpdate(BaseModel):
    status: LeaveStatus
    processed_by: str = Field(..., min_length=2, max_length=100)

class LeaveBalance(BaseModel):
    employee_id: int
    available_days: float
    used_days: float
    pending_days: float
    annual_entitlement: float

class ErrorResponse(BaseModel):
    error: str
    detail: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
