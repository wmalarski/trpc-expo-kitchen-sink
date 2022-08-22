import { useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { trpc } from '../../utils/trpc';

export const useQuestionsSubscription = () => {
  const client = trpc.useContext();

  useEffect(() => {
    const subscription = supabase
      .from('Question')
      .on('INSERT', () => {
        client.invalidateQueries(['question.list']);
      })
      .on('DELETE', () => {
        client.invalidateQueries(['question.list']);
      })
      .on('UPDATE', () => {
        // client.getInfiniteQueryData(["question.list", args])
        client.invalidateQueries(['question.list']);
      })
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [client]);
};
