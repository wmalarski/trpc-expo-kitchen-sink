import { useQuestionsSubscription } from '@tens/common/src/services/useQuestionSubscription';
import { ErrorMessage } from '@tens/next/components/ErrorMessage/ErrorMessage';
import { Loader } from '@tens/next/components/Loader/Loader';
import { supabase } from '@tens/next/utils/supabase';
import { trpc } from '@tens/next/utils/trpc';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Rooms.List' });

  const trpcContext = trpc.useContext();

  const query = trpc.proxy.question.list.useInfiniteQuery(
    { take, roomId, answered: showAnswered },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.cursor,
      onSuccess: async (data) => {
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
    return (
      <ErrorMessage
        message={query.error.message}
        onReloadClick={() => query.refetch()}
      />
    );
  }

  const canAnswer = query.data.pages[0].canAnswer;

  return (
    <div className="flex flex-col gap-4">
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
      {query.hasNextPage && (
        <button className="btn" onClick={() => query.fetchNextPage()}>
          {t('showMore')}
        </button>
      )}
    </div>
  );
};
