import { Session } from '@supabase/supabase-js';
import type { AppRouter } from '@tens/api/src/routes';
import { createReactQueryHooks } from '@trpc/react';
import Constants from 'expo-constants';
import superjson from 'superjson';

const { manifest } = Constants;

export const trpc = createReactQueryHooks<AppRouter>();

export const transformer = superjson;

export const createTrpcClient = (session: Session | null) => {
  const localhost = `http://${manifest.debuggerHost?.split(':').shift()}:3000`;

  return trpc.createClient({
    url: `${localhost}/api/trpc`,

    async headers() {
      if (!session) return {};

      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    },
    transformer,
  });
};
