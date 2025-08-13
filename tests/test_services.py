import pytest
from datetime import date, datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Employee
from app.services import EmployeeService, LeaveService
from app.schemas import EmployeeCreate, LeaveRequestCreate

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_services.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_calculate_leave_days():
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 5)
    days = LeaveService.calculate_leave_days(start_date, end_date)
    assert days == 5

def test_calculate_annual_entitlement_current_year():
    from datetime import date
    current_year = date.today().year
    joining_date = date(current_year, 6, 1)
    annual_leave = 25.0
    entitlement = LeaveService.calculate_annual_entitlement(joining_date, annual_leave)
    assert entitlement > 0
    if date.today().month > 6:
        assert entitlement < annual_leave
    else:
        assert entitlement <= annual_leave

def test_calculate_annual_entitlement_previous_year():
    joining_date = date(2023, 1, 1)
    annual_leave = 25.0
    entitlement = LeaveService.calculate_annual_entitlement(joining_date, annual_leave)
    assert entitlement == annual_leave

def test_employee_service_create_duplicate_email(db_session):
    employee_data = EmployeeCreate(
        name="John Doe",
        email="john@company.com",
        department="Engineering",
        joining_date=date(2024, 1, 1)
    )
    
    EmployeeService.create_employee(db_session, employee_data)
    
    with pytest.raises(ValueError, match="Employee with this email already exists"):
        EmployeeService.create_employee(db_session, employee_data)

def test_employee_service_future_joining_date(db_session):
    employee_data = EmployeeCreate(
        name="Future Employee",
        email="future@company.com",
        department="HR",
        joining_date=date(2025, 12, 31)
    )
    
    with pytest.raises(ValueError, match="Joining date cannot be in the future"):
        EmployeeService.create_employee(db_session, employee_data)

def test_leave_service_employee_not_found(db_session):
    leave_data = LeaveRequestCreate(
        employee_id=999,
        start_date=date(2024, 3, 1),
        end_date=date(2024, 3, 5),
        reason="Test leave"
    )
    
    with pytest.raises(ValueError, match="Employee not found"):
        LeaveService.apply_leave(db_session, leave_data)

def test_leave_balance_employee_not_found(db_session):
    with pytest.raises(ValueError, match="Employee not found"):
        LeaveService.get_leave_balance(db_session, 999)
