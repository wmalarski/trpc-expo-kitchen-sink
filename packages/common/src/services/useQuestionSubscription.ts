import { SupabaseClient } from '@supabase/supabase-js';
import type { AppRouter } from '@tens/api/src/routes';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';
import { useEffect } from 'react';

type Props = {
  roomId: string;
  supabase: SupabaseClient;
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useQuestionsSubscription = ({ roomId, trpc, supabase }: Props) => {
  const client = trpc.useContext();

  useEffect(() => {
    const subscription = supabase
      .from(`Question:roomId=eq.${roomId}`)
      .on('*', () => client.invalidateQueries(['question.list']))
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [client, roomId, supabase]);
};
