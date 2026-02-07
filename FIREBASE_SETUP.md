# Firebase Migration Setup Guide

This document describes how to set up Firebase for the Trustika app, including necessary configuration and environment variables.

## Overview

The Trustika app has been migrated from Supabase to Firebase. This migration includes:
- **Firebase Authentication** for Google Sign-In and Phone Number OTP authentication
- **Firestore** for user profile storage
- **AsyncStorage** for auth token persistence in React Native

## Prerequisites

1. A Firebase project created in the [Firebase Console](https://console.firebase.google.com/)
2. The project ID matches the one in `android/app/google-services.json`
3. Node.js and Expo CLI installed

## Firebase Console Configuration

### 1. Enable Authentication Methods

Go to **Authentication > Sign-in method** in your Firebase Console and enable:

#### a) Phone Number Sign-In
- Click **Phone**
- Toggle **Enable**
- Optionally add test phone numbers for development
- Save

#### b) Google Sign-In
- Click **Google**
- Toggle **Enable**
- Provide a project support email
- Save

### 2. Create Firestore Database

Go to **Firestore Database** and create a new database:

- **Location**: Choose your region (e.g., `us-central1`)
- **Security rules mode**: Start in **Test mode** for development (see production rules below)
- Create

### 3. Configure Android OAuth (for native development builds)

If you're building with `expo run:android` or `eas build`:

1. Go to **Project Settings > OAuth consent screen**
2. Create an OAuth 2.0 Client ID for Android
3. Add your app's SHA-1 certificate fingerprint (get from `eas credential`)
4. Configure the authorized redirect URIs

## Environment Variables

Create a `.env` file in your project root (or use Expo's `.env` files):

```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=trustika-e014f.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=trustika-e014f
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=trustika-e014f.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

These values are available from:
1. **Firebase Console > Project Settings**
2. Look for the config object under "Your apps"
3. Copy values from the `firebaseConfig` object

Or extract from `android/app/google-services.json`:
- `project_number` → `MESSAGING_SENDER_ID`
- `project_id` → `PROJECT_ID`
- `api_key[0].current_key` → `API_KEY`

## Firestore Collections & Documents

### users Collection

The app stores user profiles in Firestore:

```
Collection: users
Document ID: Firebase Auth UID
Fields:
  uid: string (Firebase Auth UID)
  email: string | null
  full_name: string | null
  phone: string | null
  photo_url: string | null
  provider: string ("google", "phone", "apple", etc.)
  createdAt: timestamp
  updatedAt: timestamp
```

### Firestore Rules

#### Development (Test Mode)
For development and testing, Firestore can run in Test mode, which allows all reads/writes. This is NOT secure for production.

#### Production Rules
For production, use these Firestore Security Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own user document
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      allow create: if request.auth.uid != null && request.auth.uid == uid;
    }

    // Default deny for all other paths
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

To deploy these rules:
1. Go to **Firestore Database > Rules** tab
2. Paste the rules above
3. Click **Publish**

## Phone Number OTP Setup

Firebase's Phone Number authentication uses:
- **Android**: Firebase built-in SMS
- **Expo development client**: Web-based fallback (may require CORS configuration)

### For Production Android Builds

If using `eas build` or `expo run:android`:

1. Ensure your app is signed with the correct SHA-1
2. Add the SHA-1 to Firebase OAuth settings
3. Firebase will automatically handle SMS delivery

### For Expo Go / Web Testing

Phone authentication may have limitations. Test with real phone numbers in Firebase Console's test list.

## Google Sign-In Setup

### For Expo Development

The current implementation uses Firebase's web-based `signInWithPopup` which may not work in native Expo Go. For better UX in native development, consider:

1. **Option A**: Use `@react-native-google-signin/google-signin`
   - Provides native Google Sign-In UI
   - Better user experience on Android/iOS
   - Installation: `expo install @react-native-google-signin/google-signin`

2. **Option B**: Use `expo-google-app-auth`
   - Simpler setup
   - Works with Expo managed workflow
   - Installation: `expo install expo-google-app-auth`

### Configuration for Native Google Sign-In

If using Option A (`@react-native-google-signin/google-signin`):

```typescript
// In lib/firebase.ts or a setup file
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

Get your Web Client ID from Firebase Console:
1. Go to **Project Settings > Service Accounts**
2. Download the JSON key
3. Find `client_id` with `client_type` of "web"

## Testing the Migration

### Test Phone Number Authentication
1. Open Login or Register screen
2. Enter a test phone number (if you added test numbers in Firebase)
3. Verify the OTP code is sent and verification works

### Test Google Sign-In
1. Tap "Continue with Google"
2. Verify you can sign in with your Google account
3. Check that your user document appears in Firestore

### Verify Firestore Data
1. Go to **Firestore Database** in Firebase Console
2. Click on **users** collection
3. Confirm that user documents are created/updated with correct fields

## Migration Checklist

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Phone + Google)
- [ ] Firestore database created
- [ ] Environment variables added to `.env`
- [ ] `lib/firebase.ts` and `lib/firestore-user.ts` are in place
- [ ] `auth/login.tsx` and `auth/register.tsx` updated
- [ ] `app/auth/callback.tsx` updated
- [ ] `package.json` updated (Firebase added, Supabase removed)
- [ ] Firestore security rules deployed
- [ ] Phone authentication tested
- [ ] Google Sign-In tested
- [ ] User data stored in Firestore verified

## Troubleshooting

### "Phone authentication is not available"
- Check that Phone Sign-In is enabled in Firebase Console
- Verify SMS provider quotas (Firebase includes some free quota)

### "OAuth did not return a URL"
- Ensure OAuth consent screen is configured in Firebase
- Check that your app's redirect URI is correct
- Verify the web client ID (if using native sign-in library)

### Users not appearing in Firestore
- Check Firestore security rules allow write access
- Verify `upsertFirestoreUser` function is being called
- Check console logs for Firebase errors

### Phone number format issues
- Ensure Tanzania format is normalized: `07xxxxxxxx` → `+2557xxxxxxxx`
- The `normalizeTzPhone` function in `lib/phone.ts` handles this

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth for Web](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [React Native Firebase](https://rnfirebase.io/) (if upgrading to native modules)

## Next Steps

### For Better UX in Native Apps
Consider migrating to native Firebase modules:
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`

This would replace web-based auth methods with native implementations.

### For Production
- [ ] Harden Firestore security rules
- [ ] Set up Firebase performance monitoring
- [ ] Enable Firebase Analytics
- [ ] Configure email verification (optional)
- [ ] Set up custom claims for role-based access (if needed)
