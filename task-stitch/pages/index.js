/**
 * Public Dashboard - Real-time Campus Data Display
 * Shows events and faculty status with live updates from Supabase
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else {
        setEvents(eventsData || []);
      }

      // Fetch faculty
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });

      if (facultyError) {
        console.error('Error fetching faculty:', facultyError);
      } else {
        setFaculty(facultyData || []);
      }

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Setup real-time subscriptions
  const setupRealtimeSubscriptions = () => {
    // Subscribe to events table changes
    const eventsChannel = supabase
      .channel('events-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('Events change received:', payload);
          fetchData(); // Refresh data on any change
        }
      )
      .subscribe();

    // Subscribe to faculty table changes
    const facultyChannel = supabase
      .channel('faculty-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faculty',
        },
        (payload) => {
          console.log('Faculty change received:', payload);
          fetchData(); // Refresh data on any change
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(facultyChannel);
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Head>
        <title>Campus Dashboard - Jarvis Assistant</title>
        <meta name="description" content="Real-time campus events and faculty status" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">J</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Campus Dashboard</h1>
                  <p className="text-purple-300 text-sm">
                    Powered by Jarvis • Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}
                  </p>
                </div>
              </div>
              <a
                href="/admin"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Admin Panel
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-purple-300">Loading campus data...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Events Section */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">📅</span>
                    Upcoming Events
                  </h2>
                  <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                    {events.length} events
                  </span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-purple-300 text-lg">No upcoming events</p>
                      <p className="text-purple-400 text-sm mt-2">
                        Use the admin panel to create events
                      </p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-slate-800/60 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                      >
                        <h3 className="text-white font-semibold text-lg mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-purple-300">
                            <span className="mr-2">📆</span>
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-purple-300">
                            <span className="mr-2">🕐</span>
                            <span>{formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center text-purple-300">
                            <span className="mr-2">📍</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Faculty Status Section */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">👨‍🏫</span>
                    Faculty Status
                  </h2>
                  <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                    {faculty.filter((f) => f.status === 'Present').length} present
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {faculty.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-purple-300 text-lg">No faculty data</p>
                      <p className="text-purple-400 text-sm mt-2">
                        Faculty information will appear here
                      </p>
                    </div>
                  ) : (
                    faculty.map((member) => (
                      <div
                        key={member.id}
                        className="bg-slate-800/60 rounded-xl p-4 border border-purple-500/20 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              member.status === 'Present'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {member.status === 'Present' ? '✓' : '✗'}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{member.name}</h3>
                            {member.department && (
                              <p className="text-purple-400 text-sm">{member.department}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            member.status === 'Present'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {member.status || 'Unknown'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Powered by Jarvis AI Assistant
                </h3>
                <p className="text-purple-200 text-sm">
                  This dashboard updates in real-time as administrators interact with Jarvis.
                  All events, faculty status, and notifications are managed through natural
                  language commands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
