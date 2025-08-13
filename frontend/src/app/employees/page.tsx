import Link from 'next/link'
import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { EmployeeList } from '@/components/employees/employee-list'
import { Plus } from 'lucide-react'

export default function EmployeesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-2">
              Manage all employees in the system
            </p>
          </div>
          <Button asChild>
            <Link href="/employees/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Link>
          </Button>
        </div>

        <Suspense fallback={<EmployeeListLoading />}>
          <EmployeeList />
        </Suspense>
      </div>
    </MainLayout>
  )
}

function EmployeeListLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg p-6 h-24" />
        </div>
      ))}
    </div>
  )
}
