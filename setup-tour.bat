@echo off
REM Trustika Guided Tour - Quick Setup Script (Windows)
REM This script helps set up the guided tour component

echo.
echo ==============================
echo Trustika Guided Tour Setup
echo ==============================
echo.

REM Step 1: Install AsyncStorage
echo 📦 Step 1: Installing AsyncStorage dependency...
echo.

REM Check for Expo first (most common for Expo projects)
where expo >nul 2>nul
if %errorlevel% equ 0 (
    echo 📝 Detected Expo. Installing with expo...
    call expo install @react-native-async-storage/async-storage
    goto :verify
)

REM Check for yarn
where yarn >nul 2>nul
if %errorlevel% equ 0 (
    echo 📝 Detected yarn. Installing with yarn...
    call yarn add @react-native-async-storage/async-storage
    goto :verify
)

REM Default to npm
echo 📝 Using npm...
call npm install @react-native-async-storage/async-storage

:verify
echo.
echo ✅ Dependency installation complete!
echo.

REM Step 2: Verification
echo 🔍 Step 2: Verifying installation...
echo.

if exist "components\HomeGuideTour.tsx" (
    echo ✅ HomeGuideTour.tsx component found
) else (
    echo ❌ HomeGuideTour.tsx not found!
)

findstr /M "HomeGuideTour" "app\screens\HomeScreen.tsx" >nul
if %errorlevel% equ 0 (
    echo ✅ HomeScreen integration found
) else (
    echo ❌ HomeScreen integration not found!
)

findstr /M "@react-native-async-storage/async-storage" "package.json" >nul
if %errorlevel% equ 0 (
    echo ✅ AsyncStorage dependency found in package.json
) else (
    echo ❌ AsyncStorage dependency not in package.json!
)

echo.
echo ==============================
echo ✨ Setup Complete!
echo ==============================
echo.

echo 📚 Next Steps:
echo 1. Run: npm start ^(or expo start^)
echo 2. Open the app and navigate to Home
echo 3. Tour should appear automatically on first load
echo 4. Click Next to advance through all 3 steps
echo.

echo 📖 Documentation:
echo - TOUR_QUICKSTART.md - Quick reference
echo - GUIDED_TOUR_SETUP.md - Full setup guide
echo - COMPONENT_DOCUMENTATION.md - Code documentation
echo - INTEGRATION_VERIFICATION.md - Verify installation
echo.

echo Happy coding! 🚀
echo.

pause
