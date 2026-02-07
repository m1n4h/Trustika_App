# 🚀 Getting Started - 5 Minutes

## The Quick Path to a Working Tour

> **Estimated time: 5 minutes** ⏱️

---

## Step 1: Install AsyncStorage (2 minutes)

Choose **ONE** command based on your setup:

### 🌐 Expo Projects (Recommended)
```bash
expo install @react-native-async-storage/async-storage
```

### 📦 npm Projects
```bash
npm install @react-native-async-storage/async-storage
```

### 🎀 Yarn Projects
```bash
yarn add @react-native-async-storage/async-storage
```

### ⚡ Windows Users
Double-click `setup-tour.bat` to automate everything!

---

## Step 2: Run Your App (1 minute)

```bash
expo start
```

Then:
- **Android:** Press `a` or run `expo run:android`
- **iOS:** Press `i` or run `expo run:ios`
- **Expo Go:** Scan QR code with phone

---

## Step 3: Test the Tour (2 minutes)

1. **Navigate to Home screen** if not already there
2. **Tour appears automatically** on first load
3. **Click "Next"** to advance through steps
4. **Click "Got it"** to finish
5. ✅ **Done!** Tour is working

---

## 📊 What You Just Installed

✅ **HomeGuideTour Component** - Professional animated tour  
✅ **Integration with HomeScreen** - Ready to use  
✅ **AsyncStorage** - Persistence (one-time display)  
✅ **3 Tour Steps** - Food, Pharmacy, Send To  

---

## 🎯 Tour Overview

| Step | Target | Message |
|------|--------|---------|
| 1️⃣ | Trustika Food | "Here is the place to order delicious food." |
| 2️⃣ | Trustika Pharmacy | "Order pharmacies or medicines now." |
| 3️⃣ | Send To | "Order a ride or send parcels here." |

---

## ❓ Tour Not Appearing?

**The tour shows only ONCE** (first time the user opens the app)

To test again:
```bash
# Option 1: Clear app data
# In settings: App info → Storage → Clear data

# Option 2: Use code
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('tour_completed');
// Then reload app
```

---

## 🎨 Want to Customize?

### Change Messages
Open `components/HomeGuideTour.tsx` and find:
```tsx
const TOUR_STEPS = [
  {
    id: 'food',
    title: 'Trustika Food',
    description: 'Your custom message here',  // ← Change this
    icon: 'restaurant',
  },
  // ...
];
```

### Change Colors
Find this in `components/HomeGuideTour.tsx`:
```tsx
<MaterialIcons name="arrow-downward" size={48} color="#F97316" />
                                              // ↑ Change to any color
```

### Change Speed
Find this in `components/HomeGuideTour.tsx`:
```tsx
withTiming(1, { duration: 1200, ... })
                        // ↑ Lower = faster (try 800)
```

---

## 📚 Need More Info?

- **Quick Reference:** See `TOUR_QUICKSTART.md`
- **Complete Setup:** See `GUIDED_TOUR_SETUP.md`
- **Code Details:** See `COMPONENT_DOCUMENTATION.md`
- **All Documentation:** See `README_INDEX.md`

---

## ✅ You're Done! 🎉

Your guided tour is now:
- ✅ Installed
- ✅ Integrated
- ✅ Working
- ✅ Ready for customization

**Enjoy your new professional tour! 🚀**

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Tour not showing | Clear AsyncStorage: `removeItem('tour_completed')` |
| Animations look choppy | Reload app, check device performance |
| Colors are wrong | Update hex values in HomeGuideTour.tsx |
| Messages need changes | Edit TOUR_STEPS constant in HomeGuideTour.tsx |

---

**Status:** ✅ Complete  
**Next:** Customize as needed or deploy!
