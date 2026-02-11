const { verifyIdToken } = require('../../helpers/firebaseAdmin');

// Express middleware that expects Authorization: Bearer <firebase-id-token>
// and populates req.user with the decoded Firebase user.
async function authenticateFirebase(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ error: true, message: 'Missing auth token' });
    }

    const decoded = await verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      phone: decoded.phone_number || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
    };
    return next();
  } catch (error) {
    console.error('[auth] token verification failed', error);
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}

module.exports = {
  authenticateFirebase,
};

