#!/bin/bash

# AmaniYield - Quick Vercel Deployment Script
# This script helps deploy to Vercel quickly

set -e

echo "🚀 AmaniYield Vercel Deployment Helper"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}✗ Vercel CLI not found${NC}"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLI found${NC}"
echo ""

# Get deployment type from user
echo "Select deployment type:"
echo "1) Frontend only (Recommended for beginners)"
echo "2) Full stack (Frontend + Backend)"
read -p "Enter choice (1 or 2): " deployment_type

if [ "$deployment_type" = "1" ]; then
    echo ""
    echo -e "${YELLOW}Deploying frontend only...${NC}"
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Build
    echo "Building frontend..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Build successful${NC}"
    echo ""
    
    # Deploy
    echo "Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✓ Frontend deployed successfully!${NC}"
    
elif [ "$deployment_type" = "2" ]; then
    echo ""
    echo -e "${YELLOW}Deploying full stack...${NC}"
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        echo -e "${RED}✗ vercel.json not found in root directory${NC}"
        exit 1
    fi
    
    # Install dependencies for both
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Build frontend
    echo "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Frontend build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Frontend build successful${NC}"
    
    # Build backend
    echo "Building backend..."
    cd backend
    npm run build
    cd ..
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Backend build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Backend build successful${NC}"
    echo ""
    
    # Deploy
    echo "Deploying to Vercel..."
    cd ..
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✓ Full stack deployed successfully!${NC}"
    
else
    echo -e "${RED}✗ Invalid choice${NC}"
    exit 1
fi

echo ""
echo "======================================="
echo "📊 Next steps:"
echo "1. Visit your Vercel dashboard"
echo "2. Configure environment variables if not already done"
echo "3. Run: vercel env pull (to sync env vars locally)"
echo "4. Test the deployed application"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
