/**
 * VIBRANT ANALYTICS DASHBOARD - SoulWare Style
 * Beautiful bright UI with vibrant colors, smooth animations
 * Matching the SoulWare aesthetic with cards, gradients, and modern design
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Bell,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Vibrant color palette matching SoulWare
const colors = {
  primary: '#6495ED', // Bright Blue
  secondary: '#E996AF', // Bright Pink
  tertiary: '#A3A3CC', // Lavender
  accent: '#ed9252ff', // Orange/Peach
  green: '#10b981', // Emerald
  purple: '#a855f7', // Purple
  orange: '#f97316', // Orange
  text: '#2D3748',
  textLight: '#4A5568',
};

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    presentFaculty: 0,
    absentFaculty: 0,
    totalNotifications: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      // Fetch faculty
      const { data: facultyData } = await supabase
        .from('faculty')
        .select('*');

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);

      setEvents(eventsData || []);
      setFaculty(facultyData || []);
      setNotifications(notificationsData || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const upcomingEvents = (eventsData || []).filter((e) => e.date >= today);
      const presentFaculty = (facultyData || []).filter((f) => f.status === 'Present');
      const absentFaculty = (facultyData || []).filter((f) => f.status === 'Absent');

      setStats({
        totalEvents: (eventsData || []).length,
        upcomingEvents: upcomingEvents.length,
        presentFaculty: presentFaculty.length,
        absentFaculty: absentFaculty.length,
        totalNotifications: (notificationsData || []).length,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getEventsByMonth = () => {
    const monthCounts = {};
    events.forEach((event) => {
      const month = new Date(event.date).toLocaleDateString('en-US', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return monthCounts;
  };

  const eventsByMonth = getEventsByMonth();
  const maxEvents = Math.max(...Object.values(eventsByMonth), 1);

  return (
    <>
      <Head>
        <title>Analytics Dashboard - Jarvis</title>
        <meta name="description" content="Campus analytics and insights" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div 
        className="min-h-screen bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.primary}20` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.secondary}20` }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Beautiful Header */}
        <motion.header
          className="relative bg-white/30 backdrop-blur-xl border-b border-white/50 shadow-lg z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1.5 rounded-2xl blur-lg"
                    style={{
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.purple})`,
                    }}
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div 
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                    }}
                  >
                    <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <motion.h1
                    className="text-2xl md:text-3xl font-black"
                    style={{
                      backgroundImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary})`,
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-transparent bg-clip-text">Analytics Dashboard</span>
                  </motion.h1>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>
                    Campus Insights & Statistics
                  </p>
                </div>
              </motion.div>
              <div className="flex space-x-3">
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-white/40 hover:bg-white/70 backdrop-blur-lg rounded-xl font-medium transition-all border border-white/50 text-sm md:text-base"
                  style={{ color: colors.text }}
                >
                  Home
                </motion.a>
                <motion.a
                  href="/admin"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 text-white rounded-xl font-medium transition-all shadow-lg text-sm md:text-base"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  Admin Panel
                </motion.a>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Vibrant Stats Cards */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Total Events Card - Blue */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Total Events</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: colors.primary }}>{stats.totalEvents}</p>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
                >
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Present Faculty Card - Green */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Present Faculty</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: colors.green }}>{stats.presentFaculty}</p>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors.green}, #34d399)` }}
                >
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Absent Faculty Card - Pink/Red */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Absent Faculty</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: colors.secondary }}>{stats.absentFaculty}</p>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary}, #f472b6)` }}
                >
                  <XCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Notifications Card - Purple */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Notifications</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: colors.purple }}>{stats.totalNotifications}</p>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors.purple}, #c084fc)` }}
                >
                  <Bell className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Vibrant Charts Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Events by Month Chart - Bright */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})` }}
                >
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors.text }}>Events by Month</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(eventsByMonth).map(([month, count], index) => (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: colors.textLight }}>{month}</span>
                      <span className="text-lg font-bold" style={{ color: colors.primary }}>{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                          width: `${(count / maxEvents) * 100}%`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxEvents) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
                {Object.keys(eventsByMonth).length === 0 && (
                  <p className="text-center py-8" style={{ color: colors.textLight }}>No event data available</p>
                )}
              </div>
            </motion.div>

            {/* Faculty Status Pie Chart - Bright */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.green}, ${colors.secondary})` }}
                >
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors.text }}>Faculty Status</h3>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl font-bold" style={{ color: colors.green }}>
                        {faculty.length > 0
                          ? Math.round((stats.presentFaculty / faculty.length) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm font-medium mt-1" style={{ color: colors.textLight }}>Present</p>
                    </div>
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={colors.secondary}
                      strokeWidth="32"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={colors.green}
                      strokeWidth="32"
                      strokeDasharray={`${
                        faculty.length > 0
                          ? (stats.presentFaculty / faculty.length) * 502.4
                          : 0
                      } 502.4`}
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.green }}></div>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>Present</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: colors.green }}>{stats.presentFaculty}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.secondary }}></div>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>Absent</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: colors.secondary }}>{stats.absentFaculty}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Notifications - Bright */}
          <motion.div 
            className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.orange})` }}
              >
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: colors.text }}>Recent Notifications</h3>
            </div>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-center py-8" style={{ color: colors.textLight }}>No notifications yet</p>
              ) : (
                notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    className="bg-white/80 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.text }}>To: {notif.recipient}</p>
                        <p className="text-sm" style={{ color: colors.textLight }}>{notif.message}</p>
                      </div>
                      <span className="text-xs whitespace-nowrap ml-4 px-2 py-1 bg-purple-100 rounded-lg" style={{ color: colors.purple }}>
                        {new Date(notif.sent_at).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
