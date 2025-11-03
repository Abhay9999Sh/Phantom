# 🤖 Jarvis - Smart Campus Assistant

A production-ready, AI-powered campus automation system that handles scheduling, attendance, notifications, and more through natural language chat.

## 🎯 Overview

Jarvis is an intelligent assistant that automates repetitive digital tasks for campus management. Staff can interact with Jarvis using natural language to:

- **Create Events**: "Add tomorrow's AI workshop at 3 PM in lab 204"
- **Mark Absences**: "Mark Dr. Smith absent for today"
- **Send Notifications**: "Notify all students about library closure"
- **General Chat**: Ask questions and get helpful responses

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    JARVIS ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 User Input (Natural Language)                           │
│           ↓                                                  │
│  🧠 The Brain (Gemini AI) → Decides what to do             │
│           ↓                                                  │
│  🕹️ The Operator (API Route) → Connects Brain + Hands      │
│           ↓                                                  │
│  🤲 The Hands (Tools) → Execute Supabase actions           │
│           ↓                                                  │
│  💾 Supabase Database → Real-time data storage             │
│           ↓                                                  │
│  📊 Public Dashboard → Live updates for everyone           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

- **Frontend**: Next.js (Pages Router) + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with real-time sync)
- **AI**: Google Gemini (Free API)
- **Styling**: TailwindCSS v4

## 📁 Project Structure

```
task-stitch/
├── lib/
│   ├── supabaseClient.js    # Supabase initialization
│   ├── tools.js              # The "Hands" - actionable functions
│   └── geminiClient.js       # The "Brain" - AI decision maker
├── pages/
│   ├── api/
│   │   └── command.js        # The "Operator" - connects Brain + Hands
│   ├── index.js              # Public Dashboard (real-time data)
│   ├── admin.js              # Admin Panel (chat interface)
│   ├── dashboard.js          # Analytics Dashboard
│   └── _app.js               # Next.js app wrapper
├── env.example               # Environment variables template
└── JARVIS_README.md          # This file
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Create the following tables:

**Events Table:**
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE events;
```

**Faculty Table:**
```sql
CREATE TABLE faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'Present',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE faculty;

-- Insert sample data
INSERT INTO faculty (name, department, status) VALUES
  ('Dr. John Smith', 'Computer Science', 'Present'),
  ('Prof. Sarah Johnson', 'Mathematics', 'Present'),
  ('Dr. Michael Brown', 'Physics', 'Present');
```

**Notifications Table (Optional):**
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent'
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### 3. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key (it's free!)
3. Copy the API key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

**Where to find these:**
- Supabase URL & Key: Project Settings → API
- Gemini API Key: From Google AI Studio

### 5. Run the Development Server

```bash
npm run dev
```

Visit:
- **Public Dashboard**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Analytics**: http://localhost:3000/dashboard

## 💡 Usage Examples

### Creating Events

**User**: "Create an AI workshop tomorrow at 3 PM in lab 204"

**Jarvis**: ✅ Event "AI workshop" successfully created for 2024-01-15 at 15:00 in lab 204.

### Marking Absences

**User**: "Mark Dr. Smith absent for today"

**Jarvis**: ✅ Dr. Smith marked absent for 2024-01-14. Notification sent to Coordinator.

### Sending Notifications

**User**: "Send announcement to all students about library closure"

**Jarvis**: ✅ Notification sent to all students.

## 🎨 Features

### ✅ Implemented

- [x] Natural language command processing
- [x] Event creation and management
- [x] Faculty absence tracking
- [x] Notification system
- [x] Real-time dashboard updates
- [x] Admin chat interface
- [x] Analytics dashboard with charts
- [x] Beautiful, modern UI with Tailwind
- [x] Responsive design

### 🚀 Bonus Features

- [x] **Analytics Dashboard**: Visual insights with charts
- [ ] **Voice Interaction**: Web Speech API integration
- [ ] **Dark/Light Mode**: Theme toggle
- [ ] **Email Integration**: Real email notifications
- [ ] **Calendar Export**: iCal/Google Calendar sync

## 🔧 Customization

### Adding New Tools

Edit `lib/tools.js` to add new functions:

```javascript
export async function your_new_tool({ param1, param2 }) {
  // Your logic here
  return "Success message";
}

// Add to toolBelt
export const toolBelt = {
  create_event,
  mark_teacher_absent,
  send_notification,
  general_chat,
  your_new_tool, // Add here
};
```

Then update `lib/geminiClient.js` to add the tool definition:

```javascript
const tools = [
  // ... existing tools
  {
    name: 'your_new_tool',
    description: 'What this tool does',
    parameters: {
      type: 'object',
      properties: {
        param1: { type: 'string', description: 'Description' },
      },
      required: ['param1'],
    },
  },
];
```

## 🐛 Troubleshooting

### "Missing environment variables"
- Ensure `.env.local` exists and contains all required variables
- Restart the dev server after adding env variables

### "Error fetching events/faculty"
- Check Supabase tables exist
- Verify real-time is enabled on tables
- Check Supabase URL and key are correct

### "Gemini API error"
- Verify API key is valid
- Check you haven't exceeded free tier limits
- Ensure no extra spaces in the API key

### Real-time updates not working
- Enable real-time on Supabase tables
- Check browser console for WebSocket errors
- Verify Supabase project is not paused

## 📊 Database Schema

### Events
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Event name |
| date | DATE | Event date |
| time | TIME | Event time |
| location | TEXT | Event location |
| created_at | TIMESTAMP | Creation timestamp |

### Faculty
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Faculty name |
| department | TEXT | Department |
| status | TEXT | Present/Absent |
| last_updated | TIMESTAMP | Last update time |

### Notifications
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| recipient | TEXT | Who receives it |
| message | TEXT | Notification content |
| sent_at | TIMESTAMP | Send timestamp |
| status | TEXT | Delivery status |

## 🎓 Hackathon Presentation Tips

1. **Demo Flow**:
   - Start with public dashboard (show it's empty)
   - Switch to admin panel
   - Create an event using natural language
   - Show real-time update on dashboard
   - Mark a teacher absent
   - Show analytics dashboard

2. **Key Talking Points**:
   - Natural language processing with Gemini AI
   - Real-time updates with Supabase
   - Production-ready architecture
   - Modular and extensible design
   - Beautiful, modern UI

3. **Wow Factors**:
   - Live real-time updates
   - Natural conversation with AI
   - Clean, professional design
   - Analytics and insights

## 📝 License

MIT License - Feel free to use this for your hackathon or personal projects!

## 🤝 Contributing

This is a hackathon project, but improvements are welcome! Feel free to:
- Add new tools/features
- Improve the AI prompts
- Enhance the UI
- Add more analytics

## 🙏 Credits

Built with:
- Next.js
- Supabase
- Google Gemini AI
- TailwindCSS

---

**Made with ❤️ for smart campus automation**
