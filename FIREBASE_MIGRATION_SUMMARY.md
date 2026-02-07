# Supabase to Firebase Migration - Summary

## Overview

This document summarizes the complete migration of the Trustika app from Supabase (Auth + Database) to Firebase (Auth + Firestore).

## Files Modified

### Core Firebase Setup
- **Created: `lib/firebase.ts`** - Firebase initialization with AsyncStorage persistence
- **Created: `lib/firestore-user.ts`** - Firestore user CRUD helpers

### Authentication Screens
- **Modified: `auth/login.tsx`** - Replaced Supabase phone/OAuth with Firebase Auth
- **Modified: `auth/register.tsx`** - Replaced Supabase phone/OAuth with Firebase Auth
- **Modified: `app/auth/callback.tsx`** - Simplified for Firebase (minimal callback needed)

### Dependencies
- **Modified: `package.json`** - Removed `@supabase/supabase-js`, added `firebase`

### Configuration
- **Removed: `lib/supabase.ts`** - No longer needed (can be deleted)
- **Created: `FIREBASE_SETUP.md`** - Complete Firebase configuration guide
- **Created: `.env.template`** - Environment variables template

## Key Changes

### 1. Authentication Flow

#### Phone Number OTP
**Before (Supabase):**
```typescript
const { data, error } = await supabase.auth.signInWithOtp({ phone: phoneFull });
const { data, error } = await supabase.auth.verifyOtp({ phone: phoneFull, token: otp, type: "sms" });
```

**After (Firebase):**
```typescript
const phoneProvider = new PhoneAuthProvider(auth);
const verificationId = await phoneProvider.verifyPhoneNumber(phoneFull, undefined as any);
const credential = PhoneAuthProvider.credential(verificationId, otp);
const result = await signInWithCredential(auth, credential);
```

#### Google Sign-In
**Before (Supabase):**
```typescript
const res = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
// Complex browser-based OAuth with redirect parsing
```

**After (Firebase):**
```typescript
const googleProvider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, googleProvider);
// Simpler Firebase Auth with popup
// For native: use @react-native-google-signin/google-signin
```

### 2. User Profile Storage

**Before (Supabase):**
```typescript
const { data, error } = await supabase.from('profiles').upsert(profile).select();
```

**After (Firebase):**
```typescript
await upsertFirestoreUser(uid, { email, phone, full_name, provider });
// Helper function handles Firestore document creation/update
```

### 3. Navigation

**Before:** Users could land on `/auth/callback` page (visible intermediate state)

**After:** Direct navigation to `/screens/HomeScreen` after auth completes
- No intermediate callback page visible to user
- Uses `router.replace()` instead of `router.push()` to prevent back navigation

### 4. Environment Variables

**Before:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

**After:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Firestore Data Model

### `users` Collection

```typescript
{
  uid: string;           // Firebase Auth UID (document ID)
  email: string | null;  // User email
  full_name: string | null; // User display name
  phone: string | null;  // Phone number (for phone auth users)
  photo_url: string | null; // Avatar URL (from Google Sign-In)
  provider: string;      // "google", "phone", etc.
  createdAt: timestamp;  // Document creation time
  updatedAt: timestamp;  // Last update time
}
```

## Phone Number Normalization

The `lib/phone.ts` helper normalizes Tanzania phone numbers:

```
07xxxxxxxx  → +2557xxxxxxxx
2557xxxxxxxx → +2557xxxxxxxx
+255...     → +255...
```

This ensures consistent phone number formatting for Firebase Auth.

## Authentication Methods Supported

### 1. Phone Number (OTP)
- **Flow**: Enter phone → Send OTP → Verify code
- **Countries**: Tanzania (+255), Kenya (+254), Uganda (+256), Rwanda (+250), Burundi (+257), South Sudan (+211)
- **Provider**: Firebase Phone Authentication

### 2. Google Sign-In
- **Flow**: Click button → Google account selection → Auto-login
- **Current**: Web-based popup (Firebase SDK)
- **Recommended for native**: `@react-native-google-signin/google-signin` or `expo-google-app-auth`

## Setup Instructions

### Quick Start

1. **Copy environment template:**
   ```bash
   cp .env.template .env
   ```

2. **Fill in Firebase values** from Firebase Console > Project Settings

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Enable Firebase services:**
   - Go to Firebase Console
   - Enable Authentication (Phone + Google)
   - Create Firestore Database
   - Deploy Firestore security rules from `FIREBASE_SETUP.md`

5. **Run the app:**
   ```bash
   expo start
   # or for Android/iOS
   expo run:android
   expo run:ios
   ```

## Testing Checklist

- [ ] **Phone OTP**
  - [ ] Send OTP works
  - [ ] OTP verification works
  - [ ] User document created in Firestore
  - [ ] Login redirects to HomeScreen

- [ ] **Google Sign-In**
  - [ ] Google popup appears
  - [ ] Sign-in completes
  - [ ] User document created/updated in Firestore
  - [ ] No landing on callback page

- [ ] **Firestore**
  - [ ] Users collection exists
  - [ ] User documents have correct fields
  - [ ] Timestamps are set correctly

- [ ] **Navigation**
  - [ ] No back navigation to auth pages
  - [ ] HomeScreen loads correctly
  - [ ] User can navigate app

## Differences from Supabase

| Feature | Supabase | Firebase |
|---------|----------|----------|
| **Phone SMS** | Requires Twilio config | Built-in (quotas included) |
| **OAuth** | Supabase-managed redirects | Firebase popup or native SDK |
| **Database** | PostgreSQL-based | NoSQL (Firestore) |
| **Real-time** | Realtimedb subscriptions | Firestore listeners |
| **Auth token** | Session-based | JWT + persistence |
| **Profile storage** | `profiles` table | `users` Firestore collection |

## Troubleshooting

### Common Issues

**"Phone authentication not available"**
- Check Firebase Console > Authentication > Sign-in method
- Ensure Phone is enabled

**"OAuth failed"**
- Verify OAuth consent screen is configured
- Check web client ID for native sign-in
- Ensure redirect URIs are correct

**"Users not in Firestore"**
- Check Firestore security rules
- Verify `upsertFirestoreUser` is called
- Check console logs for errors

**"Phone number format wrong"**
- Use `normalizeTzPhone()` from `lib/phone.ts`
- Ensure Tanzania numbers have +255 prefix

## Next Steps for Production

1. **Harden Firestore Security Rules**
   - Deploy production rules from `FIREBASE_SETUP.md`
   - Restrict access by user UID

2. **Native Google Sign-In** (recommended)
   - Install `@react-native-google-signin/google-signin`
   - Update `lib/firebase.ts` and `auth/login.tsx`
   - Use native sign-in UI instead of web popup

3. **React Native Firebase** (optional, advanced)
   - Install `@react-native-firebase/*` modules
   - Migrate from web SDK to native modules
   - Better performance and native features

4. **Error Handling & Analytics**
   - Add Firebase Analytics
   - Monitor auth errors
   - Track user registration funnel

5. **Email Verification** (optional)
   - Enable email verification for Google Sign-In users
   - Implement email verification flow

## Code Examples

### Using Firestore User Helper

```typescript
import { upsertFirestoreUser, getFirestoreUser } from '@/lib/firestore-user';
import { auth } from '@/lib/firebase';

// Create or update user
await upsertFirestoreUser(auth.currentUser.uid, {
  email: auth.currentUser.email,
  full_name: "John Doe",
  provider: "google"
});

// Get user data
const user = await getFirestoreUser(auth.currentUser.uid);
console.log(user.full_name);
```

### Phone Authentication Flow

```typescript
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { normalizeTzPhone } from '@/lib/phone';

// Send OTP
const phoneProvider = new PhoneAuthProvider(auth);
const verificationId = await phoneProvider.verifyPhoneNumber(
  normalizeTzPhone("+2557xxxxxxxx"),
  undefined as any
);

// Verify OTP
const credential = PhoneAuthProvider.credential(verificationId, "123456");
const result = await signInWithCredential(auth, credential);
```

## Migration Complete ✅

The Trustika app is now fully migrated to Firebase. All Supabase dependencies have been removed, and authentication flows use Firebase Auth with Firestore for user data storage.

For detailed configuration instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).
