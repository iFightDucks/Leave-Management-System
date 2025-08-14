export interface Employee {
  id: number
  name: string
  email: string
  department: string
  joining_date: string
  annual_leave_entitlement: number
  created_at: string
}

export interface CreateEmployeeData {
  name: string
  email: string
  department: string
  joining_date: string
  annual_leave_entitlement?: number
}

export interface LeaveRequest {
  id: number
  employee_id: number
  start_date: string
  end_date: string
  days_requested: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  applied_date: string
  processed_date?: string
  processed_by?: string
  employee_name?: string
  employee_email?: string
  employee_department?: string
}

export interface CreateLeaveRequestData {
  employee_id: number
  start_date: string
  end_date: string
  reason?: string
}

export interface LeaveBalance {
  employee_id: number
  available_days: number
  used_days: number
  pending_days: number
  annual_entitlement: number
}

export interface UpdateLeaveRequestData {
  status: 'approved' | 'rejected'
  processed_by: string
}

// UI State Types
export interface DashboardStats {
  totalEmployees: number
  pendingRequests: number
  approvedToday: number
  totalLeaveDays: number
}

// API Error Response
export interface ApiError {
  detail: string
  timestamp?: string
}
