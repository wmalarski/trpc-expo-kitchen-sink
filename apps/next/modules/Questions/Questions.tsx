import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement } from 'react';
import { useQuestionsSubscription } from './Questions.utils';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const query = trpc.useInfiniteQuery(
    ['question.list', { take, roomId, answered: showAnswered }],
    { refetchOnWindowFocus: false },
  );

  useQuestionsSubscription();

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
