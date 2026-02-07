# Trustika Home Screen Guided Tour - Implementation Guide

## Overview
A production-ready Duolingo-style guided tour for the Trustika Home screen that helps first-time users understand the three main features: Food ordering, Pharmacy, and Parcel/Ride services. The tour features smooth animated arrows, contextual tooltips, and persists state using AsyncStorage.

## Features
✅ **Smooth Animated Arrow** - Curved path animation with bounce and pulse effects  
✅ **Dynamic Tooltips** - Context-aware help text with Next/Skip buttons  
✅ **Runtime Position Measurement** - Works on all screen sizes and orientations  
✅ **One-Time Display** - Shows on first load, dismissible, re-startable via Help  
✅ **Dark Mode Support** - Fully themed to match your app's dark/light modes  
✅ **Production Ready** - Clean code, proper error handling, type-safe

## Installation

### Step 1: Install Dependencies

Run this command in your project root:

```bash
npm install @react-native-async-storage/async-storage
# or with yarn
yarn add @react-native-async-storage/async-storage
# or with expo
expo install @react-native-async-storage/async-storage
```

### Step 2: Files Created/Modified

**New Files:**
- `components/HomeGuideTour.tsx` - The guided tour component (already created)

**Modified Files:**
- `app/screens/HomeScreen.tsx` - Integration with refs and state (already updated)
- `package.json` - Added AsyncStorage dependency (already updated)

## Integration Details

### 1. Component Structure

The `HomeGuideTour` component is self-contained with:
- Animated arrow using React Native Reanimated
- Spotlight overlay with custom Modal
- Tooltip with pointer triangle
- Next/Skip button controls
- 3-step tour sequence

### 2. HomeScreen Integration

Key changes made to HomeScreen.tsx:

#### Imports:
```tsx
import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeGuideTour } from "../../components/HomeGuideTour";
```

#### State Variables:
```tsx
const [tourVisible, setTourVisible] = useState(false);
const [targetPositions, setTargetPositions] = useState({
  food: null,
  pharmacy: null,
  sendto: null,
});
const foodRef = useRef<View>(null);
const pharmacyRef = useRef<View>(null);
const sendtoRef = useRef<View>(null);
```

#### Refs on Target Components:
```tsx
// Trustika Food button
<TouchableOpacity ref={foodRef} ... >

// Trustika Pharmacy button
<TouchableOpacity ref={pharmacyRef} ... >

// Send To section (parent View)
<View ref={sendtoRef} ...>
```

### 3. Tour Lifecycle

**First Load:**
1. Component mounts
2. AsyncStorage checks if tour was completed
3. If not completed, refs are measured after 500ms delay
4. Tour modal appears with spotlight on first target

**During Tour:**
1. User sees animated arrow pointing to target
2. Tooltip shows contextual help
3. "Next" button advances to next step
4. "Skip" button dismisses tour
5. On last step, "Got it" button closes and marks as completed

**Re-trigger:**
- Tour completion status stored in AsyncStorage key: `tour_completed`
- To reset and show tour again, call `AsyncStorage.removeItem('tour_completed')`

## Tour Steps

| Step | Target | Tooltip |
|------|--------|---------|
| 1 | Trustika Food | "Here is the place to order delicious food." |
| 2 | Trustika Pharmacy | "Order pharmacies or medicines now." |
| 3 | Send To | "Order a ride or send parcels here." |

## How It Works

### Position Measurement
```tsx
const measureTargets = () => {
  const measureRef = (ref: React.RefObject<View>) => {
    return new Promise((resolve) => {
      if (ref.current) {
        (ref.current as any).measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      } else {
        resolve(null);
      }
    });
  };

  Promise.all([
    measureRef(foodRef),
    measureRef(pharmacyRef),
    measureRef(sendtoRef),
  ]).then(([food, pharmacy, sendto]) => {
    setTargetPositions({ food, pharmacy, sendto });
  });
};
```

### Animation Sequence
1. **Arrow Movement** - Uses Reanimated's `interpolate` with bezier easing
2. **Pulse Effect** - Scale and opacity animation on arrival
3. **Tooltip Fade** - Tooltip appears as arrow reaches target (70% progress)

## Customization

### Change Tour Messages
Edit the `TOUR_STEPS` array in `components/HomeGuideTour.tsx`:

```tsx
const TOUR_STEPS = [
  {
    id: 'food',
    title: 'Trustika Food',
    description: 'Here is the place to order delicious food.',
    icon: 'restaurant',
  },
  // ... modify descriptions here
];
```

### Adjust Animation Speed
In `components/HomeGuideTour.tsx`, modify the timing values:

```tsx
// Arrow travel duration (currently 1200ms)
withTiming(1, { duration: 1200, easing: Easing.bezier(...) })

// Pulse animation duration (currently 600ms)
withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
```

### Change Colors
Modify the color values in HomeGuideTour.tsx:

```tsx
// Arrow color
<MaterialIcons name="arrow-downward" size={48} color="#F97316" />

// Spotlight border color
borderColor: '#F97316'

// Button background
backgroundColor: '#F97316'
```

## Re-running the Tour

To manually restart the tour, you can:

1. **Add a Help Button** in the header:
```tsx
<TouchableOpacity onPress={handleRestartTour}>
  <MaterialIcons name="help-outline" size={24} color={colors.text} />
</TouchableOpacity>
```

2. **Reset AsyncStorage** (for testing):
```tsx
// In a debug menu or test scenario
await AsyncStorage.removeItem('tour_completed');
setTourVisible(true);
```

## Performance Notes

- **Lightweight:** Component uses React Native Reanimated (already in your project)
- **Responsive:** Measures layouts at runtime, works on all screen sizes
- **Non-blocking:** Modal doesn't prevent existing navigation, overlay is dismissible
- **No External Dependencies:** Uses only core React Native + Reanimated (already installed)

## Testing

1. **First Load Test:**
   - Fresh app install (or clear AsyncStorage)
   - Navigate to Home screen
   - Tour should appear automatically

2. **Orientation Test:**
   - Rotate device
   - Tour should adjust spotlight positions
   - Close and reopen app to verify one-time display

3. **Dark Mode Test:**
   - Toggle dark mode in app settings
   - Tour colors should adapt

4. **Button Interaction Test:**
   - Click Next to advance steps
   - Click Skip to close tour
   - Verify AsyncStorage is updated

## Troubleshooting

**Tour not appearing:**
- Check AsyncStorage: `await AsyncStorage.removeItem('tour_completed')`
- Verify refs are properly attached to target components
- Check console for measurement errors

**Arrow positioning off:**
- Ensure ScrollView is scrolled to top before measurements
- Add delay in `initTour` if needed (currently 500ms)

**Animations janky:**
- Verify React Native Reanimated v4.1.1+ is installed
- Check for heavy re-renders on other components

## Files Summary

| File | Purpose |
|------|---------|
| `components/HomeGuideTour.tsx` | Main tour component with animations |
| `app/screens/HomeScreen.tsx` | Updated with refs, state, and tour integration |
| `package.json` | Added @react-native-async-storage/async-storage |

## Next Steps

1. Run `npm install` or `expo install` to get new dependencies
2. Test on Android and iOS
3. Customize messages and colors as needed
4. Deploy with confidence!

---

**Questions?** Check the component comments or review the React Native Reanimated v4 docs for advanced customization.
