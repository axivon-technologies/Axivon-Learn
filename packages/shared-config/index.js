/**
 * AXIVON LEARN - Shared Configuration & Constants
 * Organization: Axivon Technologies
 */

module.exports = {
  APP_NAME: 'Axivon Learn',
  TAGLINE: 'Learn. Build. Grow.',
  DEFAULT_API_PORT: 5000,
  DEFAULT_WEB_PORT: 5173,
  API_PREFIX: '/api/v1',
  ROLES: {
    VISITOR: 'visitor',
    LEARNER: 'learner',
    ADMIN: 'admin'
  },
  DEFAULT_PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50
  }
};
