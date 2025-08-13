'use client'

import { useEmployee, useEmployeeLeaveBalance, useEmployeeLeaveRequests } from '@/hooks/use-employees'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeaveRequest } from '@/lib/types'
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface EmployeeDetailsProps {
  employeeId: number
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(employeeId)
  const { data: leaveBalance, isLoading: isLoadingBalance } = useEmployeeLeaveBalance(employeeId)
  const { data: leaveRequests = [], isLoading: isLoadingRequests } = useEmployeeLeaveRequests(employeeId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering: 'bg-blue-100 text-blue-800',
      Marketing: 'bg-green-100 text-green-800',
      HR: 'bg-purple-100 text-purple-800',
      Sales: 'bg-yellow-100 text-yellow-800',
      Finance: 'bg-red-100 text-red-800',
      QA: 'bg-indigo-100 text-indigo-800',
    }
    return colors[department] || 'bg-gray-100 text-gray-800'
  }

  if (isLoadingEmployee) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg p-6 h-48" />
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Employee not found
            </h3>
            <p className="text-gray-500">
              The requested employee could not be found.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Employee Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Employee Information</span>
            <Button asChild size="sm">
              <Link href="/leaves/apply">
                <Plus className="h-4 w-4 mr-2" />
                Apply Leave
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                  <Badge className={getDepartmentColor(employee.department)}>
                    {employee.department}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined on {formatDate(employee.joining_date)}</span>
                </div>
              </div>
            </div>

            {/* Leave Balance */}
            <div>
              {isLoadingBalance ? (
                <div className="animate-pulse bg-gray-200 rounded-lg h-32" />
              ) : leaveBalance ? (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">Leave Balance</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Available</p>
                      <p className="text-xl font-bold text-blue-900">{leaveBalance.available_days}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Used</p>
                      <p className="text-xl font-bold text-blue-900">{leaveBalance.used_days}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Pending</p>
                      <p className="text-xl font-bold text-blue-900">{leaveBalance.pending_days}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Annual</p>
                      <p className="text-xl font-bold text-blue-900">{leaveBalance.annual_entitlement}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Unable to load leave balance
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests History */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRequests ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20" />
              ))}
            </div>
          ) : leaveRequests.length > 0 ? (
            <div className="space-y-4">
              {leaveRequests.map((request: LeaveRequest) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {request.days_requested} days
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>
                          {formatDate(request.start_date)} - {formatDate(request.end_date)}
                        </span>
                      </div>
                      
                      {request.reason && (
                        <p className="text-gray-700 text-sm mb-2">{request.reason}</p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Applied on {formatDate(request.applied_date)}
                        {request.processed_by && (
                          <span> • Processed by {request.processed_by}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No leave requests found for this employee</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
