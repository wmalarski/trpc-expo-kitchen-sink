import { Loader } from '@tens/next/components/Loader/Loader';
import { trpc } from '@tens/next/utils/trpc';
import { ReactElement, useState } from 'react';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const [cursor] = useState<string>();

  const query = trpc.useQuery([
    'question.list',
    { cursor, take, roomId, answered: showAnswered },
  ]);

  if (query.status === 'loading' || query.status === 'idle') {
    return <Loader />;
  }

  if (query.status === 'error') {
    return <span>{query.error.message}</span>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {query.data.questions.map((question) => (
        <QuestionsItem
          key={question.id}
          question={question}
          take={take}
          canAnswer={query.data.canAnswer}
        />
      ))}
    </div>
  );
};
