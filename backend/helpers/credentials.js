// High-level business credentials and admin settings.
// This mirrors the Enatega-style helpers/credentials.js but uses environment
// variables so that no secrets are committed to Git.
//
// Fill these in your root .env file:
//
// EMAIL_USER_NAME=your-smtp-username
// EMAIL_PASSWORD=your-smtp-password-or-app-password
// RESET_PASSWORD_LINK=https://your-domain.com/reset-password
//
// MONGO_USER=your-mongo-username
// MONGO_PASSWORD=your-mongo-password
// MONGO_DB_NAME=trustika
// MONGO_HOST=cluster0.mongodb.net
//
// ADMIN_USER_NAME=admin@example.com
// ADMIN_PASSWORD=very-strong-password
// ADMIN_USER_ID=admin-root-id
// ADMIN_NAME=Super Admin

const {
  EMAIL_USER_NAME,
  EMAIL_PASSWORD,
  RESET_PASSWORD_LINK,

  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB_NAME,

  ADMIN_USER_NAME,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  ADMIN_NAME,
} = process.env;

const emailCredentials = {
  userName: EMAIL_USER_NAME || '',
  password: EMAIL_PASSWORD || '',
  resetPasswordLink:
    RESET_PASSWORD_LINK || 'https://trustika.example.com/reset-password',
};

const mongoCredentials = {
  user: MONGO_USER || '',
  password: MONGO_PASSWORD || '',
  dbName: MONGO_DB_NAME || 'trustika',
};

const adminCredentials = {
  userName: ADMIN_USER_NAME || 'admin@example.com',
  password: ADMIN_PASSWORD || 'change-this-password',
  userId: ADMIN_USER_ID || 'admin-root-id',
  name: ADMIN_NAME || 'Trustika Admin',
};

module.exports = {
  emailCredentials,
  mongoCredentials,
  adminCredentials,
};

