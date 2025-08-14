// Simple admin authentication utilities
// TODO: Replace with proper auth system for production

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // TODO: Use environment variables
};

export const validateAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

export const createSession = (): string => {
  // Simple session token - TODO: Use proper JWT or session management
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
