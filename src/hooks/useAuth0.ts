import { useUser } from '@auth0/nextjs-auth0/client';

export function useAuth0() {
  const { user, error, isLoading } = useUser();
  return { user, error, isLoading };
}
