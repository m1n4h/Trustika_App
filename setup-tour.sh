#!/bin/bash

# Trustika Guided Tour - Quick Setup Script
# This script helps set up the guided tour component

echo "🎉 Trustika Guided Tour Setup"
echo "=============================="
echo ""

# Step 1: Install AsyncStorage
echo "📦 Step 1: Installing AsyncStorage dependency..."
echo ""

# Detect package manager
if [ -f "yarn.lock" ]; then
    echo "📝 Detected yarn. Installing with yarn..."
    yarn add @react-native-async-storage/async-storage
elif [ -f "pnpm-lock.yaml" ]; then
    echo "📝 Detected pnpm. Installing with pnpm..."
    pnpm add @react-native-async-storage/async-storage
elif command -v expo &> /dev/null; then
    echo "📝 Detected Expo. Installing with expo..."
    expo install @react-native-async-storage/async-storage
else
    echo "📝 Using npm..."
    npm install @react-native-async-storage/async-storage
fi

echo ""
echo "✅ Dependency installation complete!"
echo ""

# Step 2: Verification
echo "🔍 Step 2: Verifying installation..."
echo ""

if [ -f "components/HomeGuideTour.tsx" ]; then
    echo "✅ HomeGuideTour.tsx component found"
else
    echo "❌ HomeGuideTour.tsx not found!"
fi

if grep -q "HomeGuideTour" app/screens/HomeScreen.tsx; then
    echo "✅ HomeScreen integration found"
else
    echo "❌ HomeScreen integration not found!"
fi

if grep -q "@react-native-async-storage/async-storage" package.json; then
    echo "✅ AsyncStorage dependency found in package.json"
else
    echo "❌ AsyncStorage dependency not in package.json!"
fi

echo ""
echo "=============================="
echo "✨ Setup Complete!"
echo "=============================="
echo ""
echo "📚 Next Steps:"
echo "1. Run: npm start (or expo start)"
echo "2. Open the app and navigate to Home"
echo "3. Tour should appear automatically on first load"
echo "4. Click Next to advance through all 3 steps"
echo ""
echo "📖 Documentation:"
echo "- TOUR_QUICKSTART.md - Quick reference"
echo "- GUIDED_TOUR_SETUP.md - Full setup guide"
echo "- COMPONENT_DOCUMENTATION.md - Code documentation"
echo "- INTEGRATION_VERIFICATION.md - Verify installation"
echo ""
echo "Happy coding! 🚀"
