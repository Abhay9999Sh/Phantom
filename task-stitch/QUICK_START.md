# ⚡ Jarvis Quick Start Guide

Get Jarvis running in 10 minutes!

## 🚀 Super Quick Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

### Step 2: Setup Supabase (3 min)
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project → Wait 2 minutes
3. Go to SQL Editor → Paste contents of `supabase-setup.sql` → Run
4. Go to Settings → API → Copy URL and anon key

### Step 3: Get Gemini API Key (2 min)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Step 4: Configure Environment (1 min)
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-key-here
```

### Step 5: Run! (1 min)
```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Test It Works

### Test 1: Public Dashboard
- Go to http://localhost:3000
- Should see events and faculty data

### Test 2: Admin Panel
- Go to http://localhost:3000/admin
- Type: "Create a test event tomorrow at 2 PM in Room 101"
- Should get success message

### Test 3: Real-time Updates
- Keep dashboard open in one tab
- Create event in admin panel in another tab
- Dashboard should update automatically!

## 🎯 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Maintenance
npm install          # Install dependencies
npm update           # Update packages
```

## 📝 Quick Examples

### Create Event
```
"Add tomorrow's AI workshop at 3 PM in lab 204"
"Create a seminar on Friday at 10 AM in auditorium"
"Schedule orientation next Monday at 9 AM in main hall"
```

### Mark Absence
```
"Mark Dr. Smith absent for today"
"Dr. Johnson is not available tomorrow"
"Mark Prof. Williams absent for 2024-01-15"
```

### Send Notification
```
"Notify all students about library closure"
"Send announcement to faculty about meeting"
"Alert coordinator about schedule change"
```

## 🐛 Quick Fixes

**Problem**: Can't connect to Supabase
```bash
# Check .env.local exists and has correct values
cat .env.local
```

**Problem**: Gemini not responding
```bash
# Verify API key in .env.local
# Check you haven't exceeded rate limits
```

**Problem**: Real-time not working
```sql
-- In Supabase SQL Editor, run:
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE faculty;
```

## 📚 File Reference

| File | Purpose |
|------|---------|
| `lib/supabaseClient.js` | Database connection |
| `lib/tools.js` | Action functions |
| `lib/geminiClient.js` | AI brain |
| `pages/api/command.js` | API endpoint |
| `pages/index.js` | Public dashboard |
| `pages/admin.js` | Admin chat |
| `pages/dashboard.js` | Analytics |

## 🎨 Customization Quick Tips

### Change Colors
Edit Tailwind classes in page files:
- `from-purple-600` → `from-blue-600`
- `bg-purple-500` → `bg-green-500`

### Add New Tool
1. Add function to `lib/tools.js`
2. Add to `toolBelt` object
3. Define in `lib/geminiClient.js` tools array

### Modify UI
All pages are in `pages/` directory:
- Edit JSX directly
- Tailwind classes for styling
- React hooks for state

## 🔗 Important URLs

- **Dashboard**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Analytics**: http://localhost:3000/dashboard
- **API**: http://localhost:3000/api/command

## 📖 Full Documentation

For detailed info, see:
- `JARVIS_README.md` - Complete documentation
- `INSTALLATION.md` - Detailed setup
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_SUMMARY.md` - Architecture overview

## 🎓 Hackathon Demo Script

**30 Second Version**:
1. "Jarvis automates campus tasks with AI"
2. Show empty dashboard
3. Create event via chat
4. Show real-time update
5. "Saves hours of manual work!"

**5 Minute Version**:
1. Intro: Problem statement (30s)
2. Architecture: Show diagram (1m)
3. Demo: Create event + mark absence (2m)
4. Technical: AI + real-time (1m)
5. Impact: Benefits + future (30s)

## ✨ Pro Tips

1. **Use Quick Actions**: Click the quick action buttons in admin panel
2. **Watch Real-time**: Keep dashboard open while testing
3. **Check Console**: Browser console shows helpful logs
4. **Test Thoroughly**: Try all features before presenting
5. **Have Backup**: Screenshot working demo just in case

## 🎯 Success Checklist

Before presenting:
- [ ] Dev server runs without errors
- [ ] Can create events via chat
- [ ] Dashboard updates in real-time
- [ ] All pages load correctly
- [ ] Analytics show data
- [ ] Mobile responsive works

## 🆘 Emergency Help

If something breaks:
1. Check browser console for errors
2. Verify `.env.local` has all variables
3. Restart dev server
4. Clear browser cache
5. Check Supabase project is active

## 🎉 You're Ready!

Your Jarvis assistant is now ready to impress!

**Next Steps**:
- Customize the UI
- Add more tools
- Deploy to Vercel
- Win that hackathon! 🏆

---

**Need more help?** Check the full documentation files.
