const jwt = require('jsonwebtoken');

class SessionManager {
  constructor() {
    if (!SessionManager.instance) {
      SessionManager.instance = this;
    }
    return SessionManager.instance;
  }

  createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

const instance = new SessionManager();
Object.freeze(instance);

module.exports = instance;
