'use client'

import { useEmployees } from '@/hooks/use-employees'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Mail, 
  Calendar, 
  Building, 
  Eye, 
  User 
} from 'lucide-react'
import Link from 'next/link'

export function EmployeeList() {
  const { data: employees = [], isLoading, error } = useEmployees()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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

  if (isLoading) {
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading employees. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No employees found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first employee.
            </p>
            <Button asChild>
              <Link href="/employees/new">Add Employee</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Joining Date</TableHead>
                <TableHead className="hidden lg:table-cell">Leave Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="md:hidden mt-1">
                          <Badge className={getDepartmentColor(employee.department)}>
                            {employee.department}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    <Badge className={getDepartmentColor(employee.department)}>
                      {employee.department}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(employee.joining_date)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm font-medium text-green-600">
                      {employee.annual_leave_entitlement} days
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/employees/${employee.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
