# 🔧 Fix: App Router / Pages Router Conflict

## The Problem
Next.js detected both App Router (`app/` directory) and Pages Router (`pages/` directory) with conflicting routes.

## The Solution
We're using **Pages Router** for Jarvis, so we need to remove or rename the `app/` directory.

## Quick Fix (Choose One)

### Option 1: Rename (Recommended - Keeps Backup)
In PowerShell, run:
```powershell
Rename-Item -Path "app" -NewName "app_old_backup"
```

### Option 2: Delete (Clean Removal)
In PowerShell, run:
```powershell
Remove-Item -Path "app" -Recurse -Force
```

### Option 3: Manual (Via File Explorer)
1. Open File Explorer
2. Navigate to `C:\Krishna_Jain\Phantom\task-stitch`
3. Right-click the `app` folder
4. Choose "Rename" → rename to `app_old_backup`
   OR
   Choose "Delete"

## After Fixing

1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   npm run dev
   ```
3. The error should be gone!

## What We Changed

✅ Created `styles/globals.css` with Tailwind directives
✅ Updated `pages/_app.js` to import from `styles/` instead of `app/`
⚠️ Need to remove/rename `app/` directory (you need to do this)

## Verification

After fixing, you should see:
```
✓ Ready in XXXXms
```

And be able to visit:
- http://localhost:3001 (or 3000)
- No more conflict errors!

---

**Note**: The `app/` directory was from the original project setup. We're using Pages Router for Jarvis, which is simpler and works perfectly for this project.
