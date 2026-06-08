process.env.NODE_ENV = 'test';
// Avoid refreshToken() scheduling a 5s setTimeout (development-only path).
process.env.APP_NODE_ENV = 'test';
process.env.DOTENV_CONFIG_QUIET = 'true';
