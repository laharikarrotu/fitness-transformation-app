import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    // Match all routes except public routes and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|$|about).*)',
  ],
};