// src/lib/auth0/config.ts
import { getSession, getAccessToken, withApiAuthRequired, withPageAuthRequired } from '@auth0/nextjs-auth0';

export const authConfig = {
  auth0: {
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
      callback: '/api/auth/callback',
      login: '/api/auth/login',
      logout: '/api/auth/logout'
    }
  }
};

// Helper functions
export const getUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const getAuthToken = async () => {
  const { accessToken } = await getAccessToken();
  return accessToken;
};

// HOCs for protecting routes
export const withAuth = withPageAuthRequired;
export const withApiAuth = withApiAuthRequired;