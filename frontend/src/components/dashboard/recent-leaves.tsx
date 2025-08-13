'use client'

import { useLeaveRequests } from '@/hooks/use-leaves'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User } from 'lucide-react'
import Link from 'next/link'

export function RecentLeaves() {
  const { data: leaveRequests = [], isLoading } = useLeaveRequests()
  
  // Get the 5 most recent leave requests
  const recentLeaves = leaveRequests.slice(0, 5)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Leave Requests</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/leaves">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentLeaves.map((leave) => (
            <div key={leave.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {leave.employee_name || `Employee ID: ${leave.employee_id}`}
                  </span>
                  <Badge className={getStatusColor(leave.status)}>
                    {leave.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                  </span>
                  <span>({leave.days_requested} days)</span>
                </div>
                {leave.reason && (
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {leave.reason}
                  </p>
                )}
              </div>
            </div>
          ))}

          {recentLeaves.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent leave requests</p>
            </div>
          )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
