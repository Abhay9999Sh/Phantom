-- Jarvis Campus Assistant - Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CREATE EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Allow all operations on events" ON events
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time for events
ALTER PUBLICATION supabase_realtime ADD TABLE events;

-- ============================================
-- 2. CREATE FACULTY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'Present' CHECK (status IN ('Present', 'Absent')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Allow all operations on faculty" ON faculty
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time for faculty
ALTER PUBLICATION supabase_realtime ADD TABLE faculty;

-- Insert sample faculty data
INSERT INTO faculty (name, department, status) VALUES
  ('Dr. John Smith', 'Computer Science', 'Present'),
  ('Prof. Sarah Johnson', 'Mathematics', 'Present'),
  ('Dr. Michael Brown', 'Physics', 'Present'),
  ('Dr. Emily Davis', 'Chemistry', 'Present'),
  ('Prof. Robert Wilson', 'Engineering', 'Present')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. CREATE NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'pending', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Allow all operations on notifications" ON notifications
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at);

-- ============================================
-- 5. CREATE SAMPLE EVENTS (OPTIONAL)
-- ============================================
INSERT INTO events (title, date, time, location) VALUES
  ('Orientation Day', CURRENT_DATE + INTERVAL '1 day', '09:00', 'Main Auditorium'),
  ('AI Workshop', CURRENT_DATE + INTERVAL '2 days', '14:00', 'Lab 204'),
  ('Career Fair', CURRENT_DATE + INTERVAL '5 days', '10:00', 'Campus Ground'),
  ('Guest Lecture on ML', CURRENT_DATE + INTERVAL '7 days', '15:30', 'Seminar Hall')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify setup:
-- SELECT * FROM events;
-- SELECT * FROM faculty;
-- SELECT * FROM notifications;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Jarvis database setup completed successfully!';
  RAISE NOTICE '📊 Tables created: events, faculty, notifications';
  RAISE NOTICE '🔄 Real-time enabled on all tables';
  RAISE NOTICE '👥 Sample data inserted';
END $$;
