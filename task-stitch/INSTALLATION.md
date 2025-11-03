# 🚀 Jarvis Installation Guide

Follow these steps to get Jarvis up and running on your machine.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works!)
- A Google Gemini API key (free!)

## Step-by-Step Installation

### 1. Install Required Dependencies

Run this command in your project directory:

```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

Or if you prefer yarn:

```bash
yarn add @supabase/supabase-js @google/generative-ai axios dotenv
```

### 2. Set Up Supabase Database

#### A. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Jarvis Campus
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
5. Wait for project to be created (~2 minutes)

#### B. Run the Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see success messages

#### C. Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" or use existing
5. Copy the API key (starts with `AIza...`)

**Important**: Keep this key secret! Never commit it to GitHub.

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of your project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

Replace the placeholder values with your actual credentials from steps 2 and 3.

### 5. Verify Installation

Run the development server:

```bash
npm run dev
```

You should see:

```
✓ Ready in Xms
○ Local: http://localhost:3000
```

### 6. Test the Application

Open your browser and visit:

1. **Public Dashboard**: http://localhost:3000
   - Should show sample events and faculty data

2. **Admin Panel**: http://localhost:3000/admin
   - Try typing: "Create a test event tomorrow at 2 PM in Room 101"

3. **Analytics**: http://localhost:3000/dashboard
   - Should show statistics and charts

## Troubleshooting

### ❌ "Cannot find module '@supabase/supabase-js'"

**Solution**: Run the installation command again:
```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

### ❌ "Missing Supabase environment variables"

**Solution**: 
1. Make sure `.env.local` file exists in the root directory
2. Check that variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart the dev server after creating/editing `.env.local`

### ❌ "Error fetching events" or "Error fetching faculty"

**Solution**:
1. Verify you ran the `supabase-setup.sql` script
2. Check tables exist in Supabase dashboard → Table Editor
3. Verify real-time is enabled (should see green dot next to table names)

### ❌ "Gemini API error" or "Invalid API key"

**Solution**:
1. Verify API key is correct (no extra spaces)
2. Make sure you're using `GEMINI_API_KEY` (not `GOOGLE_API_KEY`)
3. Check you haven't exceeded free tier limits
4. Try generating a new API key

### ❌ Real-time updates not working

**Solution**:
1. In Supabase dashboard, go to Database → Replication
2. Make sure `supabase_realtime` publication includes your tables
3. Check browser console for WebSocket errors
4. Verify your Supabase project is not paused

### ❌ "Module not found: Can't resolve '../app/globals.css'"

**Solution**: The globals.css file should exist. If not, create it:
```bash
# Create if missing
mkdir -p app
touch app/globals.css
```

Then add basic Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Verification Checklist

Before presenting or deploying, verify:

- [ ] All dependencies installed (`node_modules` folder exists)
- [ ] `.env.local` file created with all 3 variables
- [ ] Supabase tables created (events, faculty, notifications)
- [ ] Real-time enabled on all tables
- [ ] Sample data visible in Supabase Table Editor
- [ ] Dev server starts without errors
- [ ] Public dashboard loads and shows data
- [ ] Admin panel chat works
- [ ] Creating an event updates dashboard in real-time
- [ ] Analytics page shows charts

## Next Steps

Once everything is working:

1. **Customize**: Add your own tools in `lib/tools.js`
2. **Style**: Modify colors and design in the page files
3. **Deploy**: Use Vercel for free hosting
4. **Present**: Show off your working AI assistant!

## Need Help?

Check the main `JARVIS_README.md` for:
- Architecture details
- Usage examples
- Customization guide
- Database schema

---

**Happy Building! 🚀**
