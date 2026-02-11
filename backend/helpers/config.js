// Central API configuration, reading from environment variables.
// Mirrors the style of Enatega's helpers/config.js but adapted for Trustika.

const path = require('path');

const {
  NODE_ENV,
  API_PORT,
  API_BASE_URL,
  CORS_ORIGINS,

  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
  MONGO_HOST,

  FIREBASE_SERVICE_ACCOUNT_PATH,

  STRIPE_SECRET_KEY,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,

  AMPLITUDE_API_KEY,
  SENTRY_DSN,
} = process.env;

const mongoUser = MONGO_USER || '';
const mongoPassword = MONGO_PASSWORD || '';
const mongoDbName = MONGO_DB_NAME || 'trustika';
const mongoHost = MONGO_HOST || 'localhost:27017';

// Build a standard MongoDB connection URI using username/password/db name
// Example: mongodb+srv://user:pass@cluster.mongodb.net/trustika
const mongoUri = process.env.MONGO_URI || (mongoUser
  ? `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(
      mongoPassword,
    )}@${mongoHost}/${mongoDbName}?retryWrites=true&w=majority`
  : `mongodb://${mongoHost}/${mongoDbName}`);

const apiConfig = {
  env: NODE_ENV || 'development',
  port: Number(API_PORT) || 4001,
  baseUrl: API_BASE_URL || 'http://localhost:4001',
  corsOrigins: (CORS_ORIGINS || 'http://localhost:19006,http://localhost:3000')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean),
  mongoUri,
  amplitudeApiKey: AMPLITUDE_API_KEY || '',
  sentryDsn: SENTRY_DSN || '',
  stripeSecretKey: STRIPE_SECRET_KEY || '',
  paypalClientId: PAYPAL_CLIENT_ID || '',
  paypalClientSecret: PAYPAL_CLIENT_SECRET || '',
  firebaseServiceAccountPath:
    FIREBASE_SERVICE_ACCOUNT_PATH &&
    path.isAbsolute(FIREBASE_SERVICE_ACCOUNT_PATH)
      ? FIREBASE_SERVICE_ACCOUNT_PATH
      : FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.join(process.cwd(), FIREBASE_SERVICE_ACCOUNT_PATH)
      : null,
};

module.exports = {
  apiConfig,
};

