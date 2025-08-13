import pytest
from datetime import date

def test_create_employee(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-15"
    }
    response = client.post("/api/v1/employees", json=employee_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john.doe@company.com"

def test_create_duplicate_employee(client):
    employee_data = {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "joining_date": "2024-01-15"
    }
    client.post("/api/v1/employees", json=employee_data)
    response = client.post("/api/v1/employees", json=employee_data)
    assert response.status_code == 400

def test_create_employee_future_joining_date(client):
    employee_data = {
        "name": "Future Employee",
        "email": "future@company.com",
        "department": "HR",
        "joining_date": "2025-12-31"
    }
    response = client.post("/api/v1/employees", json=employee_data)
    assert response.status_code == 400

def test_get_employees(client):
    employee_data = {
        "name": "Jane Smith",
        "email": "jane.smith@company.com",
        "department": "Marketing",
        "joining_date": "2024-02-01"
    }
    client.post("/api/v1/employees", json=employee_data)
    
    response = client.get("/api/v1/employees")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Jane Smith"

def test_get_employee_by_id(client):
    employee_data = {
        "name": "Bob Wilson",
        "email": "bob.wilson@company.com",
        "department": "Sales",
        "joining_date": "2024-01-01"
    }
    create_response = client.post("/api/v1/employees", json=employee_data)
    employee_id = create_response.json()["id"]
    
    response = client.get(f"/api/v1/employees/{employee_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Bob Wilson"

def test_get_nonexistent_employee(client):
    response = client.get("/api/v1/employees/999")
    assert response.status_code == 404
