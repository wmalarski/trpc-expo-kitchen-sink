import { useQuestionsSubscription } from '@tens/common/src/services/useQuestionSubscription';
import { Loader } from '@tens/next/components/Loader/Loader';
import { supabase } from '@tens/next/utils/supabase';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const trpcContext = trpc.useContext();

  const query = trpc.useInfiniteQuery(
    ['question.list', { take, roomId, answered: showAnswered }],
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.cursor,
      onSuccess: async (data) => {
        await trpcContext.cancelQuery(['question.get']);
        data.pages
          .flatMap((page) => page.questions)
          .forEach((question) => {
            trpcContext.setQueryData(
              ['question.get', { questionId: question.id }],
              question,
            );
          });
      },
    },
  );

  useQuestionsSubscription({
    roomId,
    supabase,
    trpc,
  });

  if (query.status === 'loading' || query.status === 'idle') {
    return <Loader />;
  }

  if (query.status === 'error') {
    return <span>{query.error.message}</span>;
  }

  const canAnswer = query.data.pages[0].canAnswer;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {query.data.pages
        .flatMap((page) => page.questions)
        .map((question) => (
          <QuestionsItem
            key={question.id}
            question={question}
            take={take}
            canAnswer={canAnswer}
            showAnswered={showAnswered}
          />
        ))}
    </div>
  );
};
