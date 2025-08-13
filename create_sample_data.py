from datetime import date, timedelta
from app.database import SessionLocal, create_tables
from app.services import EmployeeService, LeaveService
from app.schemas import EmployeeCreate, LeaveRequestCreate

def create_sample_data():
    create_tables()
    
    db = SessionLocal()
    
    try:
        print("🏢 Creating sample employees...")
        
        employees_data = [
            {
                "name": "Alice Johnson",
                "email": "alice.johnson@company.com",
                "department": "Engineering",
                "joining_date": date(2024, 1, 15),
                "annual_leave_entitlement": 25.0
            },
            {
                "name": "Bob Smith",
                "email": "bob.smith@company.com", 
                "department": "Marketing",
                "joining_date": date(2024, 2, 1),
                "annual_leave_entitlement": 22.0
            },
            {
                "name": "Carol Davis",
                "email": "carol.davis@company.com",
                "department": "HR",
                "joining_date": date(2023, 6, 1),
                "annual_leave_entitlement": 28.0
            },
            {
                "name": "David Wilson",
                "email": "david.wilson@company.com",
                "department": "Sales",
                "joining_date": date(2024, 3, 15),
                "annual_leave_entitlement": 20.0
            },
            {
                "name": "Emma Brown",
                "email": "emma.brown@company.com",
                "department": "Engineering",
                "joining_date": date(2023, 8, 1),
                "annual_leave_entitlement": 25.0
            }
        ]
        
        created_employees = []
        for emp_data in employees_data:
            try:
                employee = EmployeeService.create_employee(
                    db, EmployeeCreate(**emp_data)
                )
                created_employees.append(employee)
                print(f"✅ Created employee: {employee.name}")
            except ValueError as e:
                print(f"⚠️  Employee {emp_data['name']} already exists: {e}")
                existing = EmployeeService.get_employee_by_email(db, emp_data['email'])
                if existing:
                    created_employees.append(existing)
        
        print(f"\n📝 Creating sample leave requests...")
        
        # Sample leave requests
        leave_requests = [
            {
                "employee_id": created_employees[0].id,
                "start_date": date.today() + timedelta(days=30),
                "end_date": date.today() + timedelta(days=34),
                "reason": "Annual vacation to Europe"
            },
            {
                "employee_id": created_employees[1].id,
                "start_date": date.today() + timedelta(days=15),
                "end_date": date.today() + timedelta(days=17),
                "reason": "Family wedding"
            },
            {
                "employee_id": created_employees[2].id,
                "start_date": date.today() + timedelta(days=45),
                "end_date": date.today() + timedelta(days=49),
                "reason": "Personal matters"
            },
            {
                "employee_id": created_employees[3].id,
                "start_date": date.today() + timedelta(days=7),
                "end_date": date.today() + timedelta(days=9),
                "reason": "Long weekend break"
            }
        ]
        
        created_requests = []
        for req_data in leave_requests:
            try:
                leave_request = LeaveService.apply_leave(
                    db, LeaveRequestCreate(**req_data)
                )
                created_requests.append(leave_request)
                employee_name = next(e.name for e in created_employees if e.id == req_data["employee_id"])
                print(f"✅ Created leave request for {employee_name}: {req_data['reason']}")
            except ValueError as e:
                print(f"⚠️  Failed to create leave request: {e}")
        
        # Approve some requests
        print(f"\n✅ Approving some leave requests...")
        from app.schemas import LeaveRequestUpdate
        
        for i, request in enumerate(created_requests[:2]):
            try:
                update_data = LeaveRequestUpdate(
                    status="approved", 
                    processed_by="HR Manager"
                )
                LeaveService.update_leave_status(db, request.id, update_data)
                print(f"✅ Approved leave request #{request.id}")
            except ValueError as e:
                print(f"⚠️  Failed to approve request: {e}")
        
        # Reject one request
        if len(created_requests) > 2:
            try:
                update_data = LeaveRequestUpdate(
                    status="rejected", 
                    processed_by="HR Manager"
                )
                LeaveService.update_leave_status(db, created_requests[2].id, update_data)
                print(f"❌ Rejected leave request #{created_requests[2].id}")
            except ValueError as e:
                print(f"⚠️  Failed to reject request: {e}")
        
        print(f"\n📊 Sample data summary:")
        print(f"   👥 Employees created: {len(created_employees)}")
        print(f"   📝 Leave requests created: {len(created_requests)}")
        print(f"   ✅ Approved requests: 2")
        print(f"   ❌ Rejected requests: 1")
        print(f"   ⏳ Pending requests: {max(0, len(created_requests) - 3)}")
        
        print(f"\n🔍 Sample API calls to try:")
        print(f"   GET /api/v1/employees")
        print(f"   GET /api/v1/employees/1/leave-balance")
        print(f"   GET /api/v1/employees/1/leave-requests")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎯 Creating sample data for Leave Management System...")
    create_sample_data()
    print("✅ Sample data creation completed!")
