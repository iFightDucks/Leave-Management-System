import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentLeaves } from '@/components/dashboard/recent-leaves'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to the Leave Management System
          </p>
        </div>

        <Suspense fallback={<StatsLoading />}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-96" />}>
            <RecentLeaves />
          </Suspense>
          
          <QuickActions />
        </div>
      </div>
    </MainLayout>
  )
}

function StatsLoading() {
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
