// app/admin/page.tsx
import { ChartBarIcon, ChartPieIcon, CheckCircleIcon, CpuChipIcon } from '@heroicons/react/24/outline'

// A reusable Bento Box component
const BentoBox = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-neutral-900 rounded-xl p-6 shadow-lg ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
)

// Status component for the table
const StatusBadge = ({ status }: { status: 'Active' | 'Scheduled' | 'Cancelled' }) => {
  let colorClass = ''
  switch (status) {
    case 'Active': colorClass = 'bg-green-500'; break;
    case 'Scheduled': colorClass = 'bg-blue-500'; break;
    case 'Cancelled': colorClass = 'bg-red-500'; break;
  }
  return (
    <div className="flex items-center">
      <span className={`w-2 h-2 rounded-full ${colorClass} mr-2`}></span>
      <span className="text-neutral-300">{status}</span>
    </div>
  )
}

// Mock Data
const mockBookings = [
  { id: 'BK-001', lab: 'AI Lab', user: 'Alex Johnson', time: '14:00 - 15:00', status: 'Active' },
  { id: 'BK-002', lab: 'Lab-C', user: 'Maria Williams', time: '15:00 - 16:00', status: 'Scheduled' },
  { id: 'BK-003', lab: 'Lab-A', user: 'David Brown', time: '16:00 - 17:00', status: 'Scheduled' },
  { id: 'BK-004', lab: 'Lab-A', user: 'Shara Lee', time: '16:00 - 17:00', status: 'Cancelled' },
  { id: 'BK-005', lab: 'Lab-B', user: 'Chris Evans', time: '17:00 - 18:00', status: 'Scheduled' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black p-8 text-neutral-300">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Campus Bookings */}
        <BentoBox title="Live Campus Bookings" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="py-3 pr-3 text-sm font-semibold text-white">Booking ID</th>
                  <th className="py-3 px-3 text-sm font-semibold text-white">Lab</th>
                  <th className="py-3 px-3 text-sm font-semibold text-white">User</th>
                  <th className="py-3 px-3 text-sm font-semibold text-white">Time</th>
                  <th className="py-3 pl-3 text-sm font-semibold text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-neutral-800">
                    <td className="py-4 pr-3 text-sm font-medium text-neutral-300">{booking.id}</td>
                    <td className="py-4 px-3 text-sm text-neutral-300">{booking.lab}</td>
                    <td className="py-4 px-3 text-sm text-neutral-300">{booking.user}</td>
                    <td className="py-4 px-3 text-sm text-neutral-300">{booking.time}</td>
                    <td className="py-4 pl-3 text-sm"><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoBox>

        {/* Tasks Automated */}
        <BentoBox title="Tasks Automated" className="lg:col-span-1">
           <div className="flex flex-col items-start justify-center h-full">
            <div className="text-6xl font-bold text-purple-500 mb-2">1,482</div>
            <div className="text-lg text-green-500">+12% this week</div>
          </div>
        </BentoBox>

        {/* Resource Utilization */}
        <BentoBox title="Resource Utilization" className="lg:col-span-2">
          <div className="h-64 flex items-center justify-center">
            <p className="text-neutral-500">
              {/* Add your chart library component here (e.g., Recharts) */}
              [Bar Chart Placeholder]
            </p>
          </div>
        </BentoBox>

        {/* User Activity */}
        <BentoBox title="User Activity" className="lg:col-span-1">
          <div className="h-64 flex items-center justify-center">
            <p className="text-neutral-500">
              {/* Add your chart library component here (e.g., Recharts) */}
              [Line Graph Placeholder]
            </p>
          </div>
        </BentoBox>

      </div>
    </div>
  )
}