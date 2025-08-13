import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { 
  LeaveRequest, 
  CreateLeaveRequestData, 
  UpdateLeaveRequestData 
} from '@/lib/types'

// Fetch all leave requests (we'll need to get employee names separately)
export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leave-requests'],
    queryFn: async (): Promise<LeaveRequest[]> => {
      // Since the backend doesn't have a direct endpoint for all leave requests,
      // we'll need to fetch employees first and then their leave requests
      // For now, let's create a combined approach
      const employeesResponse = await api.get('/employees')
      const employees = employeesResponse.data
      
      const allLeaveRequests: LeaveRequest[] = []
      
      // Fetch leave requests for each employee
      for (const employee of employees) {
        try {
          const leaveResponse = await api.get(`/employees/${employee.id}/leave-requests`)
          const employeeRequests = leaveResponse.data.map((request: LeaveRequest) => ({
            ...request,
            employee_name: employee.name,
            employee_email: employee.email,
            employee_department: employee.department
          }))
          allLeaveRequests.push(...employeeRequests)
        } catch (error) {
          console.error(`Error fetching leave requests for employee ${employee.id}:`, error)
        }
      }
      
      // Sort by applied_date (most recent first)
      return allLeaveRequests.sort((a, b) => 
        new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime()
      )
    },
  })
}

// Apply for leave
export function useApplyLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateLeaveRequestData): Promise<LeaveRequest> => {
      const response = await api.post('/leave-requests', data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ 
        queryKey: ['employee-leave-requests', data.employee_id] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['leave-balance', data.employee_id] 
      })
    },
  })
}

// Approve leave request
export function useApproveLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      leaveId, 
      processedBy 
    }: { 
      leaveId: number
      processedBy: string 
    }): Promise<LeaveRequest> => {
      const response = await api.put(
        `/leave-requests/${leaveId}/approve?processed_by=${encodeURIComponent(processedBy)}`
      )
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ 
        queryKey: ['employee-leave-requests', data.employee_id] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['leave-balance', data.employee_id] 
      })
    },
  })
}

// Reject leave request
export function useRejectLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      leaveId, 
      processedBy 
    }: { 
      leaveId: number
      processedBy: string 
    }): Promise<LeaveRequest> => {
      const response = await api.put(
        `/leave-requests/${leaveId}/reject?processed_by=${encodeURIComponent(processedBy)}`
      )
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ 
        queryKey: ['employee-leave-requests', data.employee_id] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['leave-balance', data.employee_id] 
      })
    },
  })
}
