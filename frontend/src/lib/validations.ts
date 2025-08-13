import { z } from 'zod'

// Employee validation schema
export const createEmployeeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email format'),
  department: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must be less than 50 characters'),
  joining_date: z.string()
    .refine((date) => {
      const parsedDate = new Date(date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      return !isNaN(parsedDate.getTime()) && parsedDate <= today
    }, 'Joining date cannot be in the future'),
  annual_leave_entitlement: z.number()
    .min(0, 'Leave entitlement cannot be negative')
    .max(365, 'Leave entitlement cannot exceed 365 days'),
})

// Leave request validation schema
export const createLeaveRequestSchema = z.object({
  employee_id: z.number()
    .positive('Please select an employee'),
  start_date: z.string()
    .refine((date) => {
      const parsedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of today
      return !isNaN(parsedDate.getTime()) && parsedDate >= today
    }, 'Start date cannot be in the past'),
  end_date: z.string()
    .refine((date) => {
      return !isNaN(new Date(date).getTime())
    }, 'Invalid end date'),
  reason: z.string()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
}).refine((data) => {
  const startDate = new Date(data.start_date)
  const endDate = new Date(data.end_date)
  return endDate >= startDate
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date'],
})

// Leave approval/rejection schema
export const updateLeaveRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  processed_by: z.string()
    .min(2, 'Processed by name must be at least 2 characters')
    .max(100, 'Processed by name must be less than 100 characters'),
})

// Export type inference
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>
export type CreateLeaveRequestFormData = z.infer<typeof createLeaveRequestSchema>
export type UpdateLeaveRequestFormData = z.infer<typeof updateLeaveRequestSchema>
