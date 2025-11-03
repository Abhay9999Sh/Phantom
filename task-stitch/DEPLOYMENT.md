# 🌐 Jarvis Deployment Guide

Deploy your Jarvis campus assistant to production using Vercel (recommended) or other platforms.

## Option 1: Vercel (Recommended - Free & Easy)

Vercel is the easiest way to deploy Next.js applications and offers a generous free tier.

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Steps

#### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Jarvis Campus Assistant"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/jarvis-campus.git
git push -u origin main
```

**Important**: Make sure `.env.local` is in your `.gitignore` file! Never commit API keys.

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `next build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

#### 3. Add Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

**How to add**:
1. In Vercel dashboard → Your Project → Settings
2. Click "Environment Variables"
3. Add each variable one by one
4. Make sure to add them for "Production", "Preview", and "Development"

#### 4. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://jarvis-campus.vercel.app`

#### 5. Test Production

Visit your deployed URL and test:
- Public dashboard loads
- Admin panel works
- Real-time updates function
- AI commands execute properly

### Automatic Deployments

Every time you push to GitHub, Vercel will automatically:
- Build your project
- Run tests
- Deploy to production (if on main branch)
- Create preview deployments (for other branches)

---

## Option 2: Netlify

### Steps

1. Build your project locally:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Follow prompts and add environment variables in Netlify dashboard

---

## Option 3: Self-Hosted (VPS/Cloud)

### Requirements
- Ubuntu/Debian server
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

### Steps

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Clone and Setup

```bash
# Clone your repository
git clone https://github.com/yourusername/jarvis-campus.git
cd jarvis-campus

# Install dependencies
npm install

# Create .env.local with your variables
nano .env.local
```

#### 3. Build

```bash
npm run build
```

#### 4. Start with PM2

```bash
# Start the application
pm2 start npm --name "jarvis" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/jarvis
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/jarvis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Reference

Make sure these are set in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

**Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in them!

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Website loads without errors
- [ ] Public dashboard shows data
- [ ] Admin panel is accessible
- [ ] Chat functionality works
- [ ] Real-time updates work
- [ ] Events can be created
- [ ] Faculty status can be updated
- [ ] Analytics page displays correctly
- [ ] Mobile responsive design works
- [ ] SSL certificate is active (https)

---

## Performance Optimization

### 1. Enable Caching

In `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
  ],
};
```

### 2. Optimize Images

Use Next.js Image component:

```javascript
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### 3. Enable Compression

Vercel does this automatically. For self-hosted:

```nginx
# In nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to your project
2. Click "Analytics"
3. Enable Web Analytics

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Scaling Considerations

### Database
- Supabase free tier: 500MB database, 2GB bandwidth
- Upgrade to Pro ($25/mo) for production use

### API Limits
- Gemini Free: 60 requests/minute
- Consider caching responses for common queries

### Hosting
- Vercel Free: Unlimited bandwidth, 100GB-hours compute
- Upgrade to Pro ($20/mo) for team features

---

## Troubleshooting Deployment

### Build Fails

**Error**: "Module not found"
```bash
# Solution: Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

**Solution**: 
1. Verify variable names are exact
2. Redeploy after adding variables
3. Check they're set for correct environment (Production/Preview)

### Real-time Not Working in Production

**Solution**:
1. Check Supabase project isn't paused
2. Verify WebSocket connections aren't blocked
3. Check CORS settings in Supabase

---

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable RLS** (Row Level Security) in Supabase for production
4. **Add rate limiting** to API routes
5. **Use HTTPS** always in production
6. **Rotate API keys** regularly
7. **Monitor usage** to detect abuse

---

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

---

**Your Jarvis assistant is now live! 🎉**
