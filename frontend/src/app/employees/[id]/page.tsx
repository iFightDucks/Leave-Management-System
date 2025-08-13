import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { EmployeeDetails } from '@/components/employees/employee-details'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EmployeePageProps {
  params: {
    id: string
  }
}

export default function EmployeePage({ params }: EmployeePageProps) {
  const employeeId = parseInt(params.id)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
        </div>

        <Suspense fallback={<EmployeeDetailsLoading />}>
          <EmployeeDetails employeeId={employeeId} />
        </Suspense>
      </div>
    </MainLayout>
  )
}

function EmployeeDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg p-6 h-48" />
      </div>
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg p-6 h-96" />
      </div>
    </div>
  )
}
