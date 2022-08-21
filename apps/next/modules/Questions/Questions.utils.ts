import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../../utils/supabase';

export const useQuestionsSubscription = () => {
  useEffect(() => {
    const subscription = supabase
      .from('Question')
      .on('*', (payload) => {
        console.log('subscription', { payload });
      })
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const query = useQuery(['questions1'], async () => {
    const { data, error } = await supabase.from('Question').select();
    if (error) throw error;
    return data;
  });

  const query2 = useQuery(['members1'], async () => {
    const { data, error } = await supabase.from('Member').select();
    if (error) throw error;
    return data;
  });

  console.log({ data: query.data, data2: query2.data });
};
