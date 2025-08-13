import { MainLayout } from '@/components/layout/main-layout'
import { LeaveApplicationForm } from '@/components/leaves/leave-application-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ApplyLeavePage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/leaves">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leave Requests
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Leave</h1>
          <p className="text-gray-600 mt-2">
            Submit a new leave request for approval.
          </p>
        </div>

        <LeaveApplicationForm />
      </div>
    </MainLayout>
  )
}
