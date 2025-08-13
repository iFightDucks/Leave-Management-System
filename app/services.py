from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import Employee, LeaveRequest, LeaveStatus
from app.schemas import EmployeeCreate, LeaveRequestCreate, LeaveRequestUpdate
from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import Optional, List

class EmployeeService:
    @staticmethod
    def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
        if EmployeeService.get_employee_by_email(db, employee_data.email):
            raise ValueError("Employee with this email already exists")
        
        if employee_data.joining_date > date.today():
            raise ValueError("Joining date cannot be in the future")
        
        employee = Employee(**employee_data.model_dump())
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee
    
    @staticmethod
    def get_employee_by_email(db: Session, email: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.email == email).first()
    
    @staticmethod
    def get_employee_by_id(db: Session, employee_id: int) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.id == employee_id).first()
    
    @staticmethod
    def get_all_employees(db: Session, skip: int = 0, limit: int = 100) -> List[Employee]:
        return db.query(Employee).offset(skip).limit(limit).all()

class LeaveService:
    @staticmethod
    def calculate_leave_days(start_date: date, end_date: date) -> float:
        delta = end_date - start_date
        return delta.days + 1
    
    @staticmethod
    def calculate_annual_entitlement(joining_date: date, annual_leave: float) -> float:
        today = date.today()
        if joining_date.year == today.year:
            months_worked = (today.month - joining_date.month) + 1
            if today.day < joining_date.day:
                months_worked -= 1
            return round((annual_leave / 12) * max(months_worked, 0), 2)
        return annual_leave
    
    @staticmethod
    def get_leave_balance(db: Session, employee_id: int) -> dict:
        employee = EmployeeService.get_employee_by_id(db, employee_id)
        if not employee:
            raise ValueError("Employee not found")
        
        annual_entitlement = LeaveService.calculate_annual_entitlement(
            employee.joining_date, employee.annual_leave_entitlement
        )
        
        approved_requests = db.query(LeaveRequest).filter(
            and_(
                LeaveRequest.employee_id == employee_id,
                LeaveRequest.status == LeaveStatus.APPROVED
            )
        ).all()
        
        pending_requests = db.query(LeaveRequest).filter(
            and_(
                LeaveRequest.employee_id == employee_id,
                LeaveRequest.status == LeaveStatus.PENDING
            )
        ).all()
        
        used_days = sum(req.days_requested for req in approved_requests)
        pending_days = sum(req.days_requested for req in pending_requests)
        available_days = max(annual_entitlement - used_days, 0)
        
        return {
            "employee_id": employee_id,
            "available_days": available_days,
            "used_days": used_days,
            "pending_days": pending_days,
            "annual_entitlement": annual_entitlement
        }
    
    @staticmethod
    def check_overlapping_requests(db: Session, employee_id: int, start_date: date, end_date: date, exclude_id: Optional[int] = None) -> bool:
        query = db.query(LeaveRequest).filter(
            and_(
                LeaveRequest.employee_id == employee_id,
                LeaveRequest.status.in_([LeaveStatus.PENDING, LeaveStatus.APPROVED]),
                or_(
                    and_(LeaveRequest.start_date <= start_date, LeaveRequest.end_date >= start_date),
                    and_(LeaveRequest.start_date <= end_date, LeaveRequest.end_date >= end_date),
                    and_(LeaveRequest.start_date >= start_date, LeaveRequest.end_date <= end_date)
                )
            )
        )
        
        if exclude_id:
            query = query.filter(LeaveRequest.id != exclude_id)
        
        return query.first() is not None
    
    @staticmethod
    def apply_leave(db: Session, leave_data: LeaveRequestCreate) -> LeaveRequest:
        employee = EmployeeService.get_employee_by_id(db, leave_data.employee_id)
        if not employee:
            raise ValueError("Employee not found")
        
        if leave_data.start_date < employee.joining_date:
            raise ValueError("Cannot apply for leave before joining date")
        
        if leave_data.start_date < date.today():
            raise ValueError("Cannot apply for leave in the past")
        
        if leave_data.end_date < leave_data.start_date:
            raise ValueError("End date must be after start date")
        
        days_requested = LeaveService.calculate_leave_days(leave_data.start_date, leave_data.end_date)
        
        if LeaveService.check_overlapping_requests(db, leave_data.employee_id, leave_data.start_date, leave_data.end_date):
            raise ValueError("Leave request overlaps with existing request")
        
        leave_balance = LeaveService.get_leave_balance(db, leave_data.employee_id)
        if days_requested > leave_balance["available_days"]:
            raise ValueError(f"Insufficient leave balance. Available: {leave_balance['available_days']}, Requested: {days_requested}")
        
        leave_request = LeaveRequest(
            employee_id=leave_data.employee_id,
            start_date=leave_data.start_date,
            end_date=leave_data.end_date,
            days_requested=days_requested,
            reason=leave_data.reason
        )
        
        db.add(leave_request)
        db.commit()
        db.refresh(leave_request)
        return leave_request
    
    @staticmethod
    def update_leave_status(db: Session, leave_id: int, update_data: LeaveRequestUpdate) -> LeaveRequest:
        leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
        if not leave_request:
            raise ValueError("Leave request not found")
        
        if leave_request.status != LeaveStatus.PENDING:
            raise ValueError("Can only update pending leave requests")
        
        leave_request.status = update_data.status
        leave_request.processed_by = update_data.processed_by
        leave_request.processed_date = datetime.utcnow()
        
        db.commit()
        db.refresh(leave_request)
        return leave_request
    
    @staticmethod
    def get_employee_leave_requests(db: Session, employee_id: int) -> List[LeaveRequest]:
        return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee_id).all()
