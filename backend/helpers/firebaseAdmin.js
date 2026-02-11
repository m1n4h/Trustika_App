const admin = require('firebase-admin');
const fs = require('fs');
const { apiConfig } = require('./config');

let firebaseApp = null;

function initFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Prefer explicit service account path if provided
  if (apiConfig.firebaseServiceAccountPath) {
    const raw = fs.readFileSync(apiConfig.firebaseServiceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(raw);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use default GOOGLE_APPLICATION_CREDENTIALS if set
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    console.warn(
      '[firebase-admin] No service account configured. ID token verification will fail until configured.',
    );
    firebaseApp = admin.initializeApp();
  }

  return firebaseApp;
}

function getAuth() {
  initFirebaseAdmin();
  return admin.auth();
}

async function verifyIdToken(idToken) {
  const auth = getAuth();
  return auth.verifyIdToken(idToken);
}

module.exports = {
  initFirebaseAdmin,
  verifyIdToken,
};

