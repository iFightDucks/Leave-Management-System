#!/bin/bash

echo "🚀 Railway Deployment Setup"
echo "=========================="

echo "📋 Step 1: Commit Railway configuration changes..."
git add .
git commit -m "🚀 Add Railway deployment configuration

✨ Changes:
- Updated database.py for PostgreSQL support  
- Added health check endpoint
- Updated CORS for production
- Added psycopg2-binary dependency
- Created Railway deployment configs
- Added comprehensive deployment guide

🔧 Railway Config:
- Backend service with auto PostgreSQL
- Frontend service with environment variables
- Production-ready Dockerfile
- Complete deployment documentation"

echo "📤 Step 2: Push to GitHub..."
git push origin main

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Go to https://railway.app"
echo "2. Sign up with your GitHub account"
echo "3. Click 'Deploy from GitHub repo'"
echo "4. Select this repository"
echo "5. Follow the guide in RAILWAY_DEPLOYMENT.md"
echo ""
echo "📚 Documentation:"
echo "- RAILWAY_DEPLOYMENT.md (Complete deployment guide)"
echo "- .env.example (Environment variables template)"
echo ""
echo "🎉 Your Leave Management System is ready for Railway deployment!"
