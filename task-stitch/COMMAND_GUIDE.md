# 🎯 Jarvis Complete Command Guide

## Full-Fledged CRUD System - All Supported Commands

### 📅 CREATE Events

```
✅ "create AI workshop tomorrow at 3 PM in Lab 204"
✅ "add event named Tech Talk on 5 Nov 2025 at 6 PM in BPIT"
✅ "schedule hackathon for tomorrow at 9 AM in Main Hall"
✅ "create coding competition today at 2 PM in Lab 101"
✅ "add seminar on 10 December 2025 at 11 AM in Auditorium"
```

### 🔍 READ/QUERY Events

**By Timeframe:**
```
✅ "show events in next 3 months"
✅ "list all events"
✅ "what events are today"
✅ "show tomorrow's events"
✅ "list events this week"
✅ "show this month's events"
✅ "display upcoming events"
✅ "show past events"
```

**By Location:**
```
✅ "find events in Lab 204"
✅ "show events at BPIT"
✅ "list events in Main Hall"
```

**By Search Term:**
```
✅ "search for AI workshop"
✅ "find hackathon event"
✅ "show events named Tech Talk"
```

**Combined Filters:**
```
✅ "show next month's events in Lab 204"
✅ "list upcoming events at BPIT"
```

### ✏️ UPDATE Events

**Update Name/Title:**
```
✅ "update hacksilly event name to hackonly"
✅ "rename AI workshop to Advanced AI"
✅ "change Tech Talk title to Advanced Tech Talk"
```

**Update Time:**
```
✅ "change AI workshop time to 5 PM"
✅ "reschedule hackathon to 10 AM"
✅ "update Tech Talk time to 3:30 PM"
```

**Update Date:**
```
✅ "reschedule AI workshop to tomorrow"
✅ "change hackathon date to 15 Nov 2025"
✅ "move Tech Talk to next Monday"
```

**Update Location:**
```
✅ "move AI workshop to Lab 301"
✅ "change hackathon location to Main Hall"
✅ "update Tech Talk venue to Auditorium"
```

**Multiple Updates:**
```
✅ "update AI workshop time to 5 PM and location to Lab 301"
```

### 🗑️ DELETE Events

```
✅ "delete AI Workshop"
✅ "remove Tech Talk event"
✅ "cancel the hackathon"
✅ "delete event named coding competition"
```

### 👨‍🏫 FACULTY Management

```
✅ "mark Dr. Smith absent for today"
✅ "Dr. Johnson is absent tomorrow"
✅ "mark Prof. Williams absent for today"
```

### 📢 NOTIFICATIONS

```
✅ "notify all students about library closure"
✅ "send announcement to faculty about meeting"
✅ "alert coordinator about schedule change"
```

---

## 🎯 Command Patterns

### Natural Language Variations

Jarvis understands multiple ways to say the same thing:

**CREATE:**
- create / add / schedule / organize / plan

**READ:**
- show / list / get / find / search / what / display / view

**UPDATE:**
- update / change / modify / rename / reschedule / move

**DELETE:**
- delete / remove / cancel

### Smart Extraction

Jarvis automatically extracts:
- **Event names** - Even without quotes
- **Dates** - "tomorrow", "5 Nov 2025", "next Monday"
- **Times** - "3 PM", "15:00", "3:30 PM"
- **Locations** - After "in" or "at"
- **Timeframes** - "next 3 months", "this week", "today"

---

## 💡 Pro Tips

### 1. Be Natural
```
❌ Don't: "UPDATE_EVENT id=123 title='new name'"
✅ Do: "update hacksilly event name to hackonly"
```

### 2. Combine Operations
```
✅ "show events in next 3 months in Lab 204"
✅ "update AI workshop time to 5 PM and move to Lab 301"
```

### 3. Use Timeframes
```
✅ "show events today"
✅ "list this week's events"
✅ "what's happening in next 3 months"
```

### 4. Search Flexibly
```
✅ "find AI workshop"
✅ "search for hackathon"
✅ "show events named Tech Talk"
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete Event Lifecycle
```
1. "create AI workshop tomorrow at 3 PM in Lab 204"
2. "show all events"
3. "update AI workshop time to 5 PM"
4. "show all events" (verify change)
5. "delete AI workshop"
6. "show all events" (verify deletion)
```

### Scenario 2: Advanced Queries
```
1. "show events in next 3 months"
2. "list events in Lab 204"
3. "find events today"
4. "show upcoming events"
```

### Scenario 3: Bulk Management
```
1. "create event1 tomorrow at 2 PM in Lab 101"
2. "create event2 tomorrow at 3 PM in Lab 102"
3. "create event3 tomorrow at 4 PM in Lab 103"
4. "show tomorrow's events"
5. "update event1 time to 5 PM"
6. "delete event2"
```

---

## 🎓 For Hackathon Demo

### Quick Demo Script (2 minutes)

**1. Show Query Power (30s)**
```
"Show me events in next 3 months"
```

**2. Create Event (20s)**
```
"Create Hackathon Finals on 15 December 2025 at 9 AM in Main Hall"
```

**3. Update Event (20s)**
```
"Update Hackathon Finals time to 10 AM"
```

**4. Show Real-time Update (20s)**
- Switch to dashboard
- Show the event updated in real-time

**5. Delete Event (20s)**
```
"Delete Hackathon Finals"
```

**6. Verify (10s)**
```
"Show all events"
```

### Talking Points
- ✅ "Full CRUD through natural language"
- ✅ "No forms, no clicking - just chat"
- ✅ "Understands variations and typos"
- ✅ "Real-time synchronization"
- ✅ "Advanced queries with filters"

---

## 🔧 Technical Details

### Parser Priority
1. **Advanced Parser** (Primary) - Pattern matching
2. **Gemini AI** (Fallback) - For complex/ambiguous queries
3. **Default** - General chat response

### Supported Operations
- ✅ CREATE - All fields (title, date, time, location)
- ✅ READ - With filters (timeframe, location, search)
- ✅ UPDATE - Any field (title, date, time, location)
- ✅ DELETE - By title
- ✅ QUERY - Advanced filtering and sorting

### Real-time Features
- ✅ Instant database updates
- ✅ Live dashboard sync
- ✅ WebSocket connections
- ✅ Optimistic UI updates

---

## 🚀 What Makes This Special

### 1. True Natural Language
Not keyword-based - understands context and variations

### 2. Flexible Syntax
Multiple ways to express the same intent

### 3. Smart Extraction
Automatically finds dates, times, locations

### 4. Error Tolerant
Handles typos and missing information

### 5. Complete CRUD
Every database operation through chat

### 6. Real-time Sync
Changes reflect instantly everywhere

---

**You now have a production-grade, AI-powered CRUD system! 🎉**
