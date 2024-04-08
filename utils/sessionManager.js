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

}

const instance = new SessionManager();
Object.freeze(instance);

module.exports = instance;
