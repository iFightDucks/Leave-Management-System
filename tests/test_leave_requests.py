import pytest
from datetime import date, timedelta

def test_apply_leave_success(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    tomorrow = date.today() + timedelta(days=1)
    next_week = tomorrow + timedelta(days=5)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": tomorrow.isoformat(),
        "end_date": next_week.isoformat(),
        "reason": "Personal leave"
    }
    response = client.post("/api/v1/leave-requests", json=leave_data)
    assert response.status_code == 201
    data = response.json()
    assert data["employee_id"] == employee_id
    assert data["status"] == "pending"

def test_apply_leave_before_joining(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-06-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": "2024-05-01",
        "end_date": "2024-05-03",
        "reason": "Before joining"
    }
    response = client.post("/api/v1/leave-requests", json=leave_data)
    assert response.status_code == 400

def test_apply_leave_in_past(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    yesterday = date.today() - timedelta(days=1)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": yesterday.isoformat(),
        "end_date": yesterday.isoformat(),
        "reason": "Past leave"
    }
    response = client.post("/api/v1/leave-requests", json=leave_data)
    assert response.status_code == 400

def test_overlapping_leave_requests(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    tomorrow = date.today() + timedelta(days=1)
    next_week = tomorrow + timedelta(days=5)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": tomorrow.isoformat(),
        "end_date": next_week.isoformat(),
        "reason": "First leave"
    }
    client.post("/api/v1/leave-requests", json=leave_data)
    
    overlap_data = {
        "employee_id": employee_id,
        "start_date": (tomorrow + timedelta(days=2)).isoformat(),
        "end_date": (next_week + timedelta(days=2)).isoformat(),
        "reason": "Overlapping leave"
    }
    response = client.post("/api/v1/leave-requests", json=overlap_data)
    assert response.status_code == 400

def test_approve_leave_request(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    tomorrow = date.today() + timedelta(days=1)
    next_week = tomorrow + timedelta(days=3)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": tomorrow.isoformat(),
        "end_date": next_week.isoformat(),
        "reason": "Personal leave"
    }
    leave_response = client.post("/api/v1/leave-requests", json=leave_data)
    leave_id = leave_response.json()["id"]
    
    response = client.put(f"/api/v1/leave-requests/{leave_id}/approve?processed_by=HR Manager")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["processed_by"] == "HR Manager"

def test_reject_leave_request(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    tomorrow = date.today() + timedelta(days=1)
    next_week = tomorrow + timedelta(days=3)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": tomorrow.isoformat(),
        "end_date": next_week.isoformat(),
        "reason": "Personal leave"
    }
    leave_response = client.post("/api/v1/leave-requests", json=leave_data)
    leave_id = leave_response.json()["id"]
    
    response = client.put(f"/api/v1/leave-requests/{leave_id}/reject?processed_by=HR Manager")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"

def test_get_leave_balance(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01"
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    response = client.get(f"/api/v1/employees/{employee_id}/leave-balance")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == employee_id
    assert "available_days" in data
    assert "used_days" in data

def test_insufficient_leave_balance(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-01",
        "annual_leave_entitlement": 5.0
    }
    emp_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = emp_response.json()["id"]
    
    tomorrow = date.today() + timedelta(days=1)
    far_future = tomorrow + timedelta(days=10)
    
    leave_data = {
        "employee_id": employee_id,
        "start_date": tomorrow.isoformat(),
        "end_date": far_future.isoformat(),
        "reason": "Too much leave"
    }
    response = client.post("/api/v1/leave-requests", json=leave_data)
    assert response.status_code == 400
