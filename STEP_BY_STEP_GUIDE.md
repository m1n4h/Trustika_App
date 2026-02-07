# Step-by-Step Integration Guide

## Overview
This guide walks you through verifying and testing the Guided Tour implementation.

---

## ✅ Phase 1: Verify Installation (5 minutes)

### 1.1 Check File Structure

Verify these files exist:

```bash
# Windows Command Prompt
dir components\HomeGuideTour.tsx
dir app\screens\HomeScreen.tsx
type package.json | findstr "@react-native-async-storage"

# Or Windows PowerShell
Get-Item components\HomeGuideTour.tsx
Get-Item app\screens\HomeScreen.tsx
Select-String "@react-native-async-storage" package.json

# Or Mac/Linux
ls components/HomeGuideTour.tsx
ls app/screens/HomeScreen.tsx
grep "@react-native-async-storage" package.json
```

Expected output: All files found ✓

### 1.2 Check HomeScreen.tsx Integration

Look for these in `app/screens/HomeScreen.tsx`:

**Line 1-20 (Imports):**
```tsx
import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeGuideTour } from "../../components/HomeGuideTour";
```

**Around line 55-65 (State):**
```tsx
const [tourVisible, setTourVisible] = useState(false);
const [targetPositions, setTargetPositions] = useState({
  food: null as any,
  pharmacy: null as any,
  sendto: null as any,
});
const foodRef = useRef<View>(null);
const pharmacyRef = useRef<View>(null);
const sendtoRef = useRef<View>(null);
```

**Around line 110-150 (Effects & Functions):**
```tsx
useEffect(() => {
  const initTour = async () => { ... };
  initTour();
}, []);

const measureTargets = () => { ... };
const handleRestartTour = () => { ... };
```

### 1.3 Check Component Refs

Search for these in HomeScreen.tsx around line 365-385:

```tsx
<TouchableOpacity
  ref={foodRef}
  style={[styles.serviceCard, ...]}
  onPress={() => router.push("/food")}
>

<TouchableOpacity
  ref={pharmacyRef}
  style={[styles.serviceCard, ...]}
  onPress={() => router.push("/pharmacy")}
>

<View
  ref={sendtoRef}
  style={[styles.sendToContainer, ...]}
>
```

### 1.4 Check HomeGuideTour Component

Verify `components/HomeGuideTour.tsx` exists and contains:
- Import statements (line 1-25)
- TOUR_STEPS constant (line ~30)
- Interfaces (line ~50)
- HomeGuideTour component (line ~80)
- Styles (line ~350)

---

## ⚙️ Phase 2: Install Dependencies (3 minutes)

### 2.1 Install AsyncStorage

Choose ONE method:

**Option A: Expo CLI (Recommended)**
```bash
expo install @react-native-async-storage/async-storage
```

**Option B: npm**
```bash
npm install @react-native-async-storage/async-storage
```

**Option C: yarn**
```bash
yarn add @react-native-async-storage/async-storage
```

**Option D: Run Setup Script**

Windows:
```bash
setup-tour.bat
```

Mac/Linux:
```bash
bash setup-tour.sh
```

### 2.2 Verify Installation

Check `package.json` contains:
```json
"@react-native-async-storage/async-storage": "^1.23.1"
```

Or run:
```bash
npm list @react-native-async-storage/async-storage
```

Expected: Shows installed version

---

## 🧪 Phase 3: Test the Tour (10 minutes)

### 3.1 Start Development Server

```bash
expo start
```

Wait for "Expo server ready at..."

### 3.2 Run on Device/Emulator

**Option A: Expo Go (Easiest)**
- Scan QR code with phone
- Open Trustika app

**Option B: Android Emulator**
```bash
expo run:android
# or press 'a' in Expo CLI
```

**Option C: iOS Simulator**
```bash
expo run:ios
# or press 'i' in Expo CLI
```

### 3.3 Navigate to Home Screen

- Open the app
- Ensure you're on the Home screen
- Tour should appear automatically

**If tour doesn't appear:**
- Clear AsyncStorage: `AsyncStorage.removeItem('tour_completed')`
- Reload app
- Try again

### 3.4 Test Tour Interactions

Test **Step 1 - Trustika Food:**
- [ ] Arrow animates from top to Food button
- [ ] Spotlight highlights the button
- [ ] Tooltip shows: "Here is the place to order delicious food."
- [ ] "Skip" button visible
- [ ] "Next" button visible

Test **Step 2 - Trustika Pharmacy:**
- [ ] Click "Next"
- [ ] Arrow animates to Pharmacy button
- [ ] Spotlight moves to Pharmacy button
- [ ] Tooltip shows: "Order pharmacies or medicines now."

Test **Step 3 - Send To:**
- [ ] Click "Next"
- [ ] Arrow animates to Send To section
- [ ] Spotlight highlights Send To area
- [ ] Tooltip shows: "Order a ride or send parcels here."
- [ ] Button changes to "Got it"

Test **Completion:**
- [ ] Click "Got it"
- [ ] Tour closes
- [ ] Modal disappears

### 3.5 Test Persistence

- [ ] Close app completely
- [ ] Reopen app
- [ ] Navigate to Home screen
- [ ] Tour should NOT appear (already completed)

### 3.6 Test Reset

Manually trigger tour restart:

1. In your browser dev tools or app console, run:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.removeItem('tour_completed');
// Then reload app
```

2. Or add a test button temporarily:
```tsx
<TouchableOpacity onPress={async () => {
  await AsyncStorage.removeItem('tour_completed');
  setTourVisible(true);
}}>
  <Text>Show Tour Again</Text>
</TouchableOpacity>
```

### 3.7 Test Dark Mode

- [ ] Toggle app dark mode (if available)
- [ ] Tooltip colors should adapt
- [ ] Background should be dark
- [ ] Text should be light
- [ ] Reopen tour - colors persist

### 3.8 Test Responsiveness

**Different Screen Sizes:**
- [ ] Test on phone (small screen)
- [ ] Test on tablet (large screen)
- [ ] Positions should adjust correctly

**Orientation Changes:**
- [ ] Start in portrait
- [ ] Rotate to landscape
- [ ] Spotlight and tooltip should reposition
- [ ] Rotate back to portrait
- [ ] Everything returns to original position

---

## 🎯 Phase 4: Performance Testing (5 minutes)

### 4.1 Check Animation Smoothness

- [ ] Arrow motion is smooth (no stuttering)
- [ ] Pulse effect at arrival is smooth
- [ ] Tooltip fade is smooth
- [ ] 60 FPS on modern devices

### 4.2 Check Memory

Use device development tools:

**Android:**
```bash
# In Android Studio Profiler
# Open app, run tour
# Check Memory tab
# Should be < 50MB for tour component
```

**iOS:**
```bash
# In Xcode Profiler
# Open app, run tour
# Check memory usage
# Should be < 50MB for tour component
```

### 4.3 Check Load Time

- [ ] Tour appears within 1 second of Home screen load
- [ ] First animation starts immediately
- [ ] No noticeable lag

---

## ✨ Phase 5: Visual Quality Check (5 minutes)

### 5.1 Arrow Appearance

- [ ] Arrow color is orange (#F97316)
- [ ] Arrow size is appropriate (48x48)
- [ ] Arrow rotation looks natural
- [ ] Pulse effect is subtle but visible

### 5.2 Spotlight Appearance

- [ ] Spotlight has orange border
- [ ] Spotlight has subtle glow
- [ ] Rounded corners (20px radius)
- [ ] 12px padding around target

### 5.3 Tooltip Appearance

- [ ] Tooltip has white/dark background
- [ ] Tooltip has orange border
- [ ] Rounded corners (16px radius)
- [ ] Pointer triangle at top
- [ ] Shadow below tooltip
- [ ] Text is centered and readable

### 5.4 Buttons

- [ ] "Skip" button looks clickable
- [ ] "Next" button has orange background
- [ ] "Got it" button appears on last step
- [ ] Buttons are properly sized

### 5.5 Overlay

- [ ] Semi-transparent dark overlay covers screen
- [ ] Everything except spotlight is darkened
- [ ] Overlay fades in smoothly

---

## 🔧 Phase 6: Customization Testing (Optional)

### 6.1 Change Messages

Edit `components/HomeGuideTour.tsx` TOUR_STEPS:

```tsx
const TOUR_STEPS = [
  {
    id: 'food',
    title: 'Food Delivery',           // Change this
    description: 'Order amazing food', // And this
    icon: 'restaurant',
  },
  // ...
];
```

- [ ] Reload app
- [ ] Tour shows new message
- [ ] Layout adjusts to new text

### 6.2 Change Colors

Find this line in HomeGuideTour.tsx:
```tsx
<MaterialIcons name="arrow-downward" size={48} color="#F97316" />
```

Change `"#F97316"` to another color like `"#3B82F6"`:

- [ ] Reload app
- [ ] Arrow is new color
- [ ] Spotlight border is new color
- [ ] Buttons are new color

### 6.3 Change Animation Speed

Find this in HomeGuideTour.tsx:
```tsx
withTiming(1, { duration: 1200, ... })  // Change 1200 to 800
```

- [ ] Reload app
- [ ] Arrow travels faster
- [ ] Animation feels snappier

---

## ✅ Phase 7: Final Verification

### Checklist

- [ ] All files created/updated
- [ ] AsyncStorage installed
- [ ] No TypeScript errors
- [ ] App starts without crashes
- [ ] Tour appears on first load
- [ ] All 3 steps complete
- [ ] Animations are smooth
- [ ] Dark mode works
- [ ] Persistence works
- [ ] Reset works
- [ ] Performance is good
- [ ] Visual quality is good

---

## 🚨 Troubleshooting

### Tour Not Appearing

**Symptom:** App opens but no tour shows

**Solution 1: Check AsyncStorage**
```tsx
// Add this to verify
useEffect(() => {
  AsyncStorage.getItem('tour_completed').then(val => {
    console.log('tour_completed:', val);
  });
}, []);
```

**Solution 2: Clear AsyncStorage**
```bash
# In dev console or add button
AsyncStorage.removeItem('tour_completed');
// Reload app
```

**Solution 3: Verify Refs**
- Check foodRef, pharmacyRef, sendtoRef are attached
- Check they're on correct components
- Add console.log in measureTargets() to debug

### Arrow Not Animating

**Symptom:** Arrow jumps to position instead of smoothly animating

**Solution:**
- Check Reanimated v4.1.1+ is installed
- Check duration values in withTiming()
- Clear cache: `npm cache clean --force`

### Tooltip Not Showing

**Symptom:** Tooltip doesn't appear or appears off-screen

**Solution:**
- Check tooltipAnimatedStyle opacity values
- Verify targetPositions are measured correctly
- Increase y offset in "Send To" calculation

### Colors Wrong

**Symptom:** Colors don't match theme

**Solution:**
- Verify isDarkMode prop is passed correctly
- Check color hex values in HomeGuideTour.tsx
- Check ThemeContext is providing correct colors

### Refs Not Measuring

**Symptom:** Spotlight appears at wrong position

**Solution:**
- Add 500ms delay (already done)
- Ensure ScrollView is rendered first
- Check measureInWindow() calls in console
- Verify refs are attached to correct elements

---

## 📊 Test Report Template

Use this to document your testing:

```
TEST REPORT - Guided Tour Implementation
Date: ___________
Tester: _________

PHASE 1: INSTALLATION ✓/✗
- Files verified: ___
- Dependencies installed: ___
- No errors: ___

PHASE 2: FUNCTIONALITY ✓/✗
- Tour appears automatically: ___
- Step 1 works: ___
- Step 2 works: ___
- Step 3 works: ___
- Completion recorded: ___

PHASE 3: PERSISTENCE ✓/✗
- AsyncStorage saves state: ___
- Tour doesn't repeat: ___
- Manual reset works: ___

PHASE 4: PRESENTATION ✓/✗
- Animations are smooth: ___
- Colors are correct: ___
- Text is readable: ___
- Layout is proper: ___

PHASE 5: PERFORMANCE ✓/✗
- 60 FPS on animations: ___
- Memory usage normal: ___
- Load time acceptable: ___

NOTES:
_____________________
_____________________

STATUS: ✅ PASSED / ⚠️ NEEDS FIXES

Signature: ___________
```

---

## 🎉 Success!

Once all phases are complete and passing:

1. ✅ Document any customizations made
2. ✅ Brief your team on the new tour
3. ✅ Deploy to production
4. ✅ Monitor user feedback
5. ✅ Adjust messages/timing if needed

---

## 📞 Need Help?

Refer to these documents in order:

1. `TOUR_QUICKSTART.md` - Quick reference
2. `GUIDED_TOUR_SETUP.md` - Complete setup
3. `COMPONENT_DOCUMENTATION.md` - Code details
4. `VISUAL_REFERENCE.md` - Architecture diagram
5. Inline code comments in HomeGuideTour.tsx

---

**Last Updated:** January 28, 2026  
**Status:** Complete  
**Confidence:** Production-Ready ✅
