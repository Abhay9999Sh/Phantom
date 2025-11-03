# 📦 Jarvis Dependencies Guide

## Required Dependencies

To install all required dependencies for Jarvis, run:

```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

## Dependency Breakdown

### Production Dependencies

#### 1. @supabase/supabase-js
- **Version**: Latest
- **Purpose**: Supabase client for database operations
- **Features Used**:
  - Real-time subscriptions
  - Database queries (select, insert, update)
  - Authentication (future)
- **Size**: ~50KB
- **Documentation**: https://supabase.com/docs/reference/javascript

#### 2. @google/generative-ai
- **Version**: Latest
- **Purpose**: Google Gemini AI client
- **Features Used**:
  - Natural language processing
  - Function calling
  - Content generation
- **Size**: ~100KB
- **Documentation**: https://ai.google.dev/tutorials/node_quickstart

#### 3. axios
- **Version**: Latest
- **Purpose**: HTTP client for API requests
- **Features Used**:
  - POST requests to API routes
  - Error handling
  - Request/response interceptors
- **Size**: ~15KB
- **Documentation**: https://axios-http.com/

#### 4. dotenv
- **Version**: Latest
- **Purpose**: Environment variable management
- **Features Used**:
  - Load .env.local files
  - Secure configuration
- **Size**: ~5KB
- **Documentation**: https://github.com/motdotla/dotenv

### Already Installed (from existing project)

These dependencies are already in your package.json:

#### Next.js
- **Version**: 16.0.1
- **Purpose**: React framework
- **Features Used**:
  - Pages Router
  - API Routes
  - Server-side rendering
  - Static generation

#### React & React-DOM
- **Version**: 19.2.0
- **Purpose**: UI library
- **Features Used**:
  - Component-based architecture
  - Hooks (useState, useEffect)
  - Event handling

#### TailwindCSS
- **Version**: 4.x
- **Purpose**: Utility-first CSS framework
- **Features Used**:
  - Responsive design
  - Custom colors
  - Animations
  - Dark mode support

## Installation Commands

### Option 1: Install All at Once
```bash
npm install @supabase/supabase-js @google/generative-ai axios dotenv
```

### Option 2: Install One by One
```bash
npm install @supabase/supabase-js
npm install @google/generative-ai
npm install axios
npm install dotenv
```

### Using Yarn
```bash
yarn add @supabase/supabase-js @google/generative-ai axios dotenv
```

### Using pnpm
```bash
pnpm add @supabase/supabase-js @google/generative-ai axios dotenv
```

## Complete package.json

After installation, your `package.json` should include:

```json
{
  "name": "task-stitch",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@google/generative-ai": "^0.1.3",
    "@heroicons/react": "^2.2.0",
    "@prisma/client": "^6.18.0",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.5",
    "dotenv": "^16.3.1",
    "next": "16.0.1",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.24",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.1",
    "prisma": "^6.18.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## Dependency Tree

```
jarvis-campus/
├── @supabase/supabase-js
│   └── (handles database operations)
├── @google/generative-ai
│   └── (handles AI processing)
├── axios
│   └── (handles HTTP requests)
├── dotenv
│   └── (handles environment variables)
├── next
│   ├── react
│   └── react-dom
└── tailwindcss
    └── (styling)
```

## Version Compatibility

| Package | Minimum Version | Recommended |
|---------|----------------|-------------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 9.0.0 | 10.x |
| Next.js | 13.0.0 | 16.x |
| React | 18.0.0 | 19.x |

## Bundle Size Impact

| Package | Size (gzipped) | Impact |
|---------|---------------|--------|
| @supabase/supabase-js | ~50KB | Medium |
| @google/generative-ai | ~100KB | Medium |
| axios | ~15KB | Low |
| dotenv | ~5KB | Low |
| **Total Added** | **~170KB** | **Acceptable** |

## Optional Dependencies

These are not required but can enhance the project:

### For Voice Interaction
```bash
npm install react-speech-recognition
```

### For Charts (Enhanced Analytics)
```bash
npm install chart.js react-chartjs-2
```

### For Date Handling
```bash
npm install date-fns
```

### For Form Validation
```bash
npm install zod
```

### For Testing
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## Troubleshooting

### Issue: "Cannot find module"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Version conflicts
```bash
# Solution: Use exact versions
npm install @supabase/supabase-js@2.39.0 --save-exact
```

### Issue: Peer dependency warnings
```bash
# Solution: Use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

### Issue: Installation fails
```bash
# Solution: Clear npm cache
npm cache clean --force
npm install
```

## Security Considerations

### Keep Dependencies Updated
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update @supabase/supabase-js
```

### Audit for Vulnerabilities
```bash
# Run security audit
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

## Development vs Production

### Development Only
```bash
npm install --save-dev @types/node typescript
```

### Production Only
```bash
npm install --production
```

## CI/CD Considerations

For GitHub Actions or other CI/CD:

```yaml
# .github/workflows/deploy.yml
- name: Install dependencies
  run: npm ci  # Use 'ci' for faster, reproducible builds
```

## License Information

All dependencies use permissive licenses:
- @supabase/supabase-js: MIT
- @google/generative-ai: Apache 2.0
- axios: MIT
- dotenv: BSD-2-Clause

## Support & Resources

- **Supabase**: https://supabase.com/docs
- **Google AI**: https://ai.google.dev/
- **Axios**: https://axios-http.com/docs/intro
- **Next.js**: https://nextjs.org/docs

---

**Last Updated**: 2024
**Node Version**: 18+
**Package Manager**: npm/yarn/pnpm
