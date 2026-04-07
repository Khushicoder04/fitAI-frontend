# 🚀 FitAI Quick Start Guide for Deployment

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (already configured)
- Stripe test account (already configured)

## Local Development Setup

### 1. Install Dependencies
```bash
cd fitai
npm run install:all
```

### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

## Production Build

### 1. Build Frontend
```bash
cd frontend
npm run build
# Output: frontend/build/
```

### 2. Deploy Frontend
- Copy `frontend/build/` contents to your static hosting (Vercel, Netlify, S3, etc.)

### 3. Deploy Backend
- Push backend code to your server (Heroku, AWS, Azure, etc.)
- Set environment variables in hosting platform
- Run: `npm start`

## Environment Configuration

### Backend (.env)
✅ Already configured with:
- MongoDB Atlas URI
- JWT Secret
- Stripe Test Keys
- CORS for localhost:3000

**For Production**, update:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=your_production_db_uri
JWT_SECRET=your_strong_secret
STRIPE_SECRET_KEY=your_production_key
```

### Frontend (.env)
✅ Already created

**For Production**, update:
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

## Testing Before Deployment

### Test Backend
```bash
cd backend
node -c server.js        # Syntax check
npm run dev              # Start server (should show "✅ MongoDB connected")
```

### Test Frontend Build
```bash
cd frontend
npm run build            # Should complete without errors
```

## Deployment Platforms

### Option 1: Vercel (Recommended for Frontend)
```bash
cd frontend
npm install -g vercel
vercel
```

### Option 2: Netlify (Recommended for Frontend)
```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 3: Docker (Complete Stack)
```bash
docker-compose up --build
```

### Option 4: Traditional VPS
1. Install Node.js on server
2. Clone repository
3. `npm run install:all`
4. Setup PM2 for process management:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name "fitai-backend"
   ```
5. Setup Nginx as reverse proxy
6. Use Certbot for SSL

## Monitoring & Maintenance

### View Logs
- Backend: `npm run dev` or PM2 logs
- Frontend: Browser DevTools

### Update Dependencies
```bash
npm audit
npm update --save
```

### Database Backup
- MongoDB Atlas handles automatic backups

## Common Issues & Solutions

### Issue: Port 5000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: MongoDB connection failed
**Solution:**
- Verify MongoDB Atlas URI in `.env`
- Check network access settings (whitelist your IP)
- Ensure cluster is running

### Issue: CORS errors
**Solution:**
- Backend: Update FRONTEND_URL in `.env`
- Frontend: Verify REACT_APP_API_URL in `.env`

### Issue: Stripe checkout not working
**Solution:**
- Verify STRIPE_SECRET_KEY in backend `.env`
- Sign in to Stripe Dashboard → check keys
- Use test cards from Stripe documentation

## Success Indicators

After deployment, verify:
- ✅ Frontend loads at your domain
- ✅ Can register new user
- ✅ Can login successfully
- ✅ Dashboard loads recommendations
- ✅ Can upgrade to Pro
- ✅ Stripe payment works
- ✅ API health check: `GET /api/health`

## Support

For issues:
1. Check logs
2. Review DEPLOYMENT_REPORT.md
3. Check backend .env configuration
4. Verify MongoDB connectivity
5. Test API endpoints with Postman

---

**Status**: ✅ Ready to deploy!
