@echo off
REM AmaniYield - Quick Vercel Deployment Script (Windows)
REM This script helps deploy to Vercel quickly

setlocal enabledelayedexpansion

echo.
echo 🚀 AmaniYield Vercel Deployment Helper
echo =======================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Vercel CLI not found
    echo Install it with: npm install -g vercel
    pause
    exit /b 1
)

echo ✓ Vercel CLI found
echo.

REM Get deployment type from user
echo Select deployment type:
echo 1) Frontend only (Recommended for beginners)
echo 2) Full stack (Frontend + Backend)
set /p deployment_type="Enter choice (1 or 2): "

if "%deployment_type%"=="1" (
    echo.
    echo Deploying frontend only...
    cd frontend
    
    REM Check if node_modules exists
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
    )
    
    REM Build
    echo Building frontend...
    call npm run build
    
    if %errorlevel% neq 0 (
        echo ✗ Build failed
        pause
        exit /b 1
    )
    
    echo ✓ Build successful
    echo.
    
    REM Deploy
    echo Deploying to Vercel...
    call vercel --prod
    
    echo.
    echo ✓ Frontend deployed successfully!
    
) else if "%deployment_type%"=="2" (
    echo.
    echo Deploying full stack...
    
    REM Check if vercel.json exists
    if not exist "vercel.json" (
        echo ✗ vercel.json not found in root directory
        pause
        exit /b 1
    )
    
    REM Install dependencies for both
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    
    REM Build frontend
    echo Building frontend...
    cd frontend
    call npm run build
    cd ..
    
    if %errorlevel% neq 0 (
        echo ✗ Frontend build failed
        pause
        exit /b 1
    )
    
    echo ✓ Frontend build successful
    
    REM Build backend
    echo Building backend...
    cd backend
    call npm run build
    cd ..
    
    if %errorlevel% neq 0 (
        echo ✗ Backend build failed
        pause
        exit /b 1
    )
    
    echo ✓ Backend build successful
    echo.
    
    REM Deploy
    echo Deploying to Vercel...
    call vercel --prod
    
    echo.
    echo ✓ Full stack deployed successfully!
    
) else (
    echo ✗ Invalid choice
    pause
    exit /b 1
)

echo.
echo =======================================
echo 📊 Next steps:
echo 1. Visit your Vercel dashboard
echo 2. Configure environment variables if not already done
echo 3. Run: vercel env pull (to sync env vars locally)
echo 4. Test the deployed application
echo.
echo ✓ Happy deploying!
echo.
pause
