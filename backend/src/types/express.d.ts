import type { SessionClaims } from '../security/session.js';

declare global {
  namespace Express {
    interface Request {
      auth?: SessionClaims;
    }
  }
}

export {};
