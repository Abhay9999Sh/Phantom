// app/faculty/page.tsx
import { HomeIcon, BookOpenIcon, BeakerIcon, SparklesIcon, CogIcon, ArrowLeftOnRectangleIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Sidebar Nav Item
const NavItem = ({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <Link href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
    active 
      ? 'bg-purple-600 text-white' 
      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
  } transition-colors duration-200`}>
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
)

// Mock Calendar Event
const CalendarEvent = ({ title, time, color, gridCol, gridRow }: { title: string, time: string, color: string, gridCol: string, gridRow: string }) => (
  <div className={`p-4 rounded-lg ${color} ${gridCol} ${gridRow} flex flex-col`}>
    <span className="text-sm font-semibold">{title}</span>
    <span className="text-xs mt-1">{time}</span>
  </div>
)

// Mock Booking Item
const BookingItem = ({ title, lab, time }: { title: string, lab: string, time: string }) => (
  <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800">
    <h4 className="font-semibold text-white">{title}</h4>
    <p className="text-sm text-neutral-400">{lab}</p>
    <p className="text-sm text-neutral-400 mt-1">{time}</p>
  </div>
)

export default function FacultyDashboard() {
  return (
    <div className="flex min-h-screen bg-black text-neutral-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 flex flex-col p-6 border-r border-neutral-800">
        <div className="flex items-center space-x-3 mb-10">
          <UserCircleIcon className="w-10 h-10 text-purple-500" />
          <div>
            <h2 className="text-lg font-semibold text-white">Dr. Eleanor Vance</h2>
            <p className="text-sm text-neutral-400">Computer Science</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" active />
          <NavItem icon={<BookOpenIcon className="w-6 h-6" />} label="My Courses" />
          <NavItem icon={<BeakerIcon className="w-6 h-6" />} label="Lab Management" />
          <NavItem icon={<SparklesIcon className="w-6 h-6" />} label="AI Co-pilot" />
        </nav>

        <div className="space-y-2">
          <NavItem icon={<CogIcon className="w-6 h-6" />} label="Settings" />
          <NavItem icon={<ArrowLeftOnRectangleIcon className="w-6 h-6" />} label="Log out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
          <BellIcon className="w-6 h-6 text-neutral-400 hover:text-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* My Weekly Schedule */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-white mb-4">My Weekly Schedule</h2>
            <div className="bg-neutral-900 p-6 rounded-xl shadow-lg">
              
              {/* Calendar Header */}
              <div className="grid grid-cols-5 gap-4 text-center text-neutral-400 mb-4">
                <div className="text-white font-semibold">Mon 18</div>
                <div>Tue 19</div>
                <div className="bg-purple-600 rounded-lg py-1 text-white font-semibold">Wed 20</div>
                <div>Thu 21</div>
                <div>Fri 22</div>
              </div>

              {/* Calendar Grid (Simplified for demo) */}
              <div className="grid grid-cols-5 gap-4 h-[500px]">
                {/* Day 1 */}
                <div className="space-y-4">
                  <CalendarEvent title="CS101 Lecture" time="9:00 - 11:00" color="bg-blue-800 text-blue-100" gridCol="col-start-1" gridRow="row-start-1" />
                </div>
                {/* Day 2 */}
                <div className="space-y-4">
                  <CalendarEvent title="Office Hours" time="11:00 - 12:00" color="bg-green-800 text-green-100" gridCol="col-start-2" gridRow="row-start-2" />
                </div>
                {/* Day 3 */}
                <div className="space-y-4">
                  <CalendarEvent title="CS450 Seminar" time="1:00 - 2:30" color="bg-blue-800 text-blue-100" gridCol="col-start-3" gridRow="row-start-3" />
                  <CalendarEvent title="Faculty Meeting" time="3:00 - 4:00" color="bg-yellow-800 text-yellow-100" gridCol="col-start-3" gridRow="row-start-5" />
                </div>
                {/* Day 4 */}
                 <div className="space-y-4">
                  <CalendarEvent title="Project Demos" time="10:00 - 1:00" color="bg-indigo-800 text-indigo-100" gridCol="col-start-4" gridRow="row-start-1" />
                </div>
                {/* Day 5 */}
                <div />
              </div>

            </div>
          </div>

          {/* My Lab Bookings */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-white mb-4">My Lab Bookings</h2>
            <div className="space-y-4">
              <BookingItem title="AI Research Group" lab="AI Compute Cluster" time="Mon, 1:00 PM - 3:00 PM" />
              <BookingItem title="CS101 Lab Session" lab="Networking Lab" time="Wed, 3:00 PM - 5:00 PM" />
              <BookingItem title="Senior Project Demos" lab="VR/AR Center" time="Thu, 10:00 AM - 1:00 PM" />
              <BookingItem title="AI Compute Cluster" lab="AI Compute Cluster" time="Fri, 10:00 AM - 12:00 PM" />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}