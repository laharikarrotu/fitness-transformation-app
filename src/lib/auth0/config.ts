export const authConfig = {
  auth0: {
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
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

// Helper functions for user management
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

// User profile interface
export interface UserProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
  nickname?: string;
  updated_at: string;
  // Custom claims
  'https://fitness-app.com/preferences'?: {
    weight: number;
    height: number;
    age: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
  };
}

// Extended user interface for our app
export interface FitnessUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    weight: number;
    height: number;
    age: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
  };
  createdAt: Date;
  updatedAt: Date;
} 