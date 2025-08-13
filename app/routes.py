from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import EmployeeService, LeaveService
from app.schemas import (
    EmployeeCreate, EmployeeResponse, LeaveRequestCreate, 
    LeaveRequestResponse, LeaveRequestUpdate, LeaveBalance, ErrorResponse
)
from typing import List

router = APIRouter()

@router.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    try:
        employee = EmployeeService.create_employee(db, employee_data)
        return employee
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/employees", response_model=List[EmployeeResponse])
async def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = EmployeeService.get_all_employees(db, skip=skip, limit=limit)
    return employees

@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = EmployeeService.get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee

@router.post("/leave-requests", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
async def apply_leave(leave_data: LeaveRequestCreate, db: Session = Depends(get_db)):
    try:
        leave_request = LeaveService.apply_leave(db, leave_data)
        return leave_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.put("/leave-requests/{leave_id}/approve", response_model=LeaveRequestResponse)
async def approve_leave(leave_id: int, processed_by: str, db: Session = Depends(get_db)):
    try:
        update_data = LeaveRequestUpdate(status="approved", processed_by=processed_by)
        leave_request = LeaveService.update_leave_status(db, leave_id, update_data)
        return leave_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.put("/leave-requests/{leave_id}/reject", response_model=LeaveRequestResponse)
async def reject_leave(leave_id: int, processed_by: str, db: Session = Depends(get_db)):
    try:
        update_data = LeaveRequestUpdate(status="rejected", processed_by=processed_by)
        leave_request = LeaveService.update_leave_status(db, leave_id, update_data)
        return leave_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/employees/{employee_id}/leave-balance", response_model=LeaveBalance)
async def get_leave_balance(employee_id: int, db: Session = Depends(get_db)):
    try:
        balance = LeaveService.get_leave_balance(db, employee_id)
        return balance
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/employees/{employee_id}/leave-requests", response_model=List[LeaveRequestResponse])
async def get_employee_leave_requests(employee_id: int, db: Session = Depends(get_db)):
    try:
        requests = LeaveService.get_employee_leave_requests(db, employee_id)
        return requests
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
