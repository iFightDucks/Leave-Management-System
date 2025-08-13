import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Employee, CreateEmployeeData } from '@/lib/types'

// Fetch all employees
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<Employee[]> => {
      const response = await api.get('/employees')
      return response.data
    },
  })
}

// Fetch single employee
export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async (): Promise<Employee> => {
      const response = await api.get(`/employees/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create employee mutation
export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEmployeeData): Promise<Employee> => {
      const response = await api.post('/employees', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

// Get employee leave balance
export function useEmployeeLeaveBalance(employeeId: number) {
  return useQuery({
    queryKey: ['leave-balance', employeeId],
    queryFn: async () => {
      const response = await api.get(`/employees/${employeeId}/leave-balance`)
      return response.data
    },
    enabled: !!employeeId,
  })
}

// Get employee leave requests
export function useEmployeeLeaveRequests(employeeId: number) {
  return useQuery({
    queryKey: ['employee-leave-requests', employeeId],
    queryFn: async () => {
      const response = await api.get(`/employees/${employeeId}/leave-requests`)
      return response.data
    },
    enabled: !!employeeId,
  })
}
