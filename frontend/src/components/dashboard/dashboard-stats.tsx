'use client'

import { useEmployees } from '@/hooks/use-employees'
import { useLeaveRequests } from '@/hooks/use-leaves'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Clock, CheckCircle, Calendar } from 'lucide-react'

export function DashboardStats() {
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees()
  const { data: leaveRequests = [], isLoading: isLoadingLeaves } = useLeaveRequests()

  // Calculate stats from real data
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length
  const approvedToday = leaveRequests.filter(req => {
    if (req.status !== 'approved' || !req.processed_date) return false
    const today = new Date().toDateString()
    const processedDate = new Date(req.processed_date).toDateString()
    return today === processedDate
  }).length
  
  const totalLeaveDays = employees.reduce((sum, emp) => sum + emp.annual_leave_entitlement, 0)

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Requests',
      value: pendingRequests,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Approved Today',
      value: approvedToday,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Leave Days',
      value: totalLeaveDays,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (isLoadingEmployees || isLoadingLeaves) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-6 h-32" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
