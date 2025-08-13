import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlusCircle, 
  Users, 
  Calendar, 
  FileText,
  ArrowRight 
} from 'lucide-react'

const quickActions = [
  {
    title: 'Add Employee',
    description: 'Register a new employee in the system',
    href: '/employees/new',
    icon: Users,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Apply for Leave',
    description: 'Submit a new leave request',
    href: '/leaves/apply',
    icon: PlusCircle,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'View All Leaves',
    description: 'Manage and review leave requests',
    href: '/leaves',
    icon: Calendar,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Employee List',
    description: 'View and manage all employees',
    href: '/employees',
    icon: FileText,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:shadow-md transition-shadow"
              >
                <Link href={action.href}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-md text-white ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
