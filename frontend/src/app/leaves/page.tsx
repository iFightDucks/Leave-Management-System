import Link from 'next/link'
import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { LeaveRequestsList } from '@/components/leaves/leave-requests-list'
import { Plus } from 'lucide-react'

export default function LeavesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-600 mt-2">
              Manage and review all leave requests
            </p>
          </div>
          <Button asChild>
            <Link href="/leaves/apply">
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Link>
          </Button>
        </div>

        <Suspense fallback={<LeaveRequestsLoading />}>
          <LeaveRequestsList />
        </Suspense>
      </div>
    </MainLayout>
  )
}

function LeaveRequestsLoading() {
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