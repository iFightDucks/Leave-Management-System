'use client'

import { useState } from 'react'
import { useLeaveRequests, useApproveLeave, useRejectLeave } from '@/hooks/use-leaves'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  User, 
  Building, 
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { LeaveRequest } from '@/lib/types'

export function LeaveRequestsList() {
  const { data: leaveRequests = [], isLoading, error } = useLeaveRequests()
  const approveLeave = useApproveLeave()
  const rejectLeave = useRejectLeave()
  
  const [approvalDialog, setApprovalDialog] = useState<{
    isOpen: boolean
    request: LeaveRequest | null
    action: 'approve' | 'reject'
    processedBy: string
  }>({
    isOpen: false,
    request: null,
    action: 'approve',
    processedBy: ''
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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

  const handleApprovalAction = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setApprovalDialog({
      isOpen: true,
      request,
      action,
      processedBy: ''
    })
  }

  const handleConfirmAction = async () => {
    if (!approvalDialog.request || !approvalDialog.processedBy.trim()) return

    try {
      if (approvalDialog.action === 'approve') {
        await approveLeave.mutateAsync({
          leaveId: approvalDialog.request.id,
          processedBy: approvalDialog.processedBy
        })
      } else {
        await rejectLeave.mutateAsync({
          leaveId: approvalDialog.request.id,
          processedBy: approvalDialog.processedBy
        })
      }
      
      setApprovalDialog({
        isOpen: false,
        request: null,
        action: 'approve',
        processedBy: ''
      })
    } catch (error) {
      console.error('Error processing leave request:', error)
    }
  }

  const closeDialog = () => {
    setApprovalDialog({
      isOpen: false,
      request: null,
      action: 'approve',
      processedBy: ''
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-6 h-32" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading leave requests. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (leaveRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No leave requests
            </h3>
            <p className="text-gray-500 mb-6">
              No leave requests have been submitted yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {leaveRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {request.employee_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.employee_name || `Employee ID: ${request.employee_id}`}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {request.employee_department && (
                          <Badge className={getDepartmentColor(request.employee_department)}>
                            {request.employee_department}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                      </span>
                    </div>
                    <span>({request.days_requested} days)</span>
                  </div>
                  
                  {request.reason && (
                    <p className="text-gray-700 mb-2">{request.reason}</p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    <p>Applied on {formatDate(request.applied_date)}</p>
                    {request.processed_by && request.processed_date && (
                      <p>
                        Processed by {request.processed_by} on {formatDate(request.processed_date)}
                      </p>
                    )}
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleApprovalAction(request, 'approve')}
                      disabled={approveLeave.isPending || rejectLeave.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleApprovalAction(request, 'reject')}
                      disabled={approveLeave.isPending || rejectLeave.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={approvalDialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.action === 'approve' 
                ? 'Are you sure you want to approve this leave request?' 
                : 'Are you sure you want to reject this leave request?'
              }
            </DialogDescription>
          </DialogHeader>

          {approvalDialog.request && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{approvalDialog.request.employee_name}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(approvalDialog.request.start_date)} - {formatDate(approvalDialog.request.end_date)}
                  ({approvalDialog.request.days_requested} days)
                </p>
                {approvalDialog.request.reason && (
                  <p className="text-sm text-gray-700 mt-1">{approvalDialog.request.reason}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="processed-by">Processed By</Label>
                <Input
                  id="processed-by"
                  value={approvalDialog.processedBy}
                  onChange={(e) => setApprovalDialog(prev => ({ ...prev, processedBy: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction}
              disabled={!approvalDialog.processedBy.trim() || approveLeave.isPending || rejectLeave.isPending}
              className={approvalDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {(approveLeave.isPending || rejectLeave.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {approvalDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
