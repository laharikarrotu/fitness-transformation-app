import { handleAuth, handleLogin, handleLogout, handleProfile } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
export const POST = handleAuth(); 