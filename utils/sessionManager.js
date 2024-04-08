const jwt = require('jsonwebtoken');

class SessionManager {
  constructor() {
    if (!SessionManager.instance) {
      SessionManager.instance = this;
    }
    return SessionManager.instance;
  }

  // explicitly include a userId in the token payload
  createUserToken(userId) {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  }

  // General purpose token creation remains flexible
  createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  }
}

const instance = new SessionManager();
Object.freeze(instance);

module.exports = instance;
