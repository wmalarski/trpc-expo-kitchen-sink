import { SupabaseClient } from '@supabase/supabase-js';
import type { AppRouter } from '@tens/api/src/routes';
import type { CreateReactQueryHooks } from '@trpc/react/dist/createReactQueryHooks';
import { useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

type Props = {
  questionId: string;
  voteId?: string;
  supabase: SupabaseClient;
  trpc: Pick<CreateReactQueryHooks<AppRouter>, 'useContext' | 'useMutation'>;
};

export const useVoteSubscription = ({
  questionId,
  voteId,
  trpc,
  supabase,
}: Props) => {
  const trpcContext = trpc.useContext();

  const invalidate = useDebounce(() => {
    trpcContext.invalidateQueries(['question.get', { questionId }]);
  }, 250);

  useEffect(() => {
    const subscription = supabase
      .from(`Vote:questionId=eq.${questionId}`)
      .on('INSERT', async () => invalidate({}))
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [invalidate, questionId, supabase]);

  useEffect(() => {
    if (!voteId) return;

    const subscription = supabase
      .from(`Vote:id=eq.${voteId}`)
      .on('UPDATE', async () => invalidate({}))
      .on('DELETE', async () => invalidate({}))
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [invalidate, voteId, supabase]);
};
