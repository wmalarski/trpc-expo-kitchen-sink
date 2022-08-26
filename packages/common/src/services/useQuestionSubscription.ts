import { SupabaseClient } from '@supabase/supabase-js';
import type { AppRouter } from '@tens/api/src/routes';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';
import { useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

type Props = {
  roomId: string;
  supabase: SupabaseClient;
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useQuestionsSubscription = ({ roomId, trpc, supabase }: Props) => {
  const client = trpc.useContext();

  const invalidate = useDebounce(() => {
    client.invalidateQueries(['question.list']);
  }, 250);

  useEffect(() => {
    const subscription = supabase
      .from(`Question:roomId=eq.${roomId}`)
      .on('*', () => invalidate({}))
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [invalidate, roomId, supabase]);
};
